import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';

const input = resolve(process.argv[2] || '/tmp/remit-skillsh-scan/full');
const root = resolve(import.meta.dirname, '..');
const summary = JSON.parse(readFileSync(join(input, 'summary.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(input, 'manifest.json'), 'utf8'));
const repositories = readFileSync(join(input, 'repositories.jsonl'), 'utf8').trim().split('\n').map(line => JSON.parse(line));
const entries = repositories.flatMap(repository => repository.results);
const counts = summary.counts;
const risks = summary.riskCounts;
const number = value => value.toLocaleString('en-US');

if (counts.scanned < 1) throw new Error('No successful scans are available to visualize.');
if (!process.argv.includes('--allow-snapshot') && (summary.unattempted !== 0 || counts.attempted !== counts.enumerated)) {
  throw new Error('The full public-sitemap sweep must finish before publishing its results.');
}
if (entries.length !== counts.attempted || new Set(entries.map(entry => entry.url)).size !== entries.length) {
  throw new Error('Every enumerated URL must have exactly one recorded outcome.');
}
const scanned = entries.filter(entry => entry.status === 'scanned');
if (manifest.inventoryEntries !== counts.enumerated || counts.failed !== entries.length - scanned.length
  || counts.complete !== scanned.filter(entry => entry.coverage === 'complete').length
  || counts.partial !== scanned.filter(entry => entry.coverage === 'partial').length) {
  throw new Error('Coverage totals do not match the recorded outcomes.');
}
const checkedRisks = { clean: 0, low: 0, elevated: 0, high: 0 };
for (const entry of scanned) {
  if (!Number.isInteger(entry.score) || entry.score < 0 || entry.score > 100 || entry.filesScanned < 1) {
    throw new Error(`Invalid scan record for ${entry.url}`);
  }
  const bucket = entry.score === 0 ? 'clean' : entry.score < 25 ? 'low' : entry.score < 50 ? 'elevated' : 'high';
  if (bucket !== entry.riskBucket) throw new Error(`Score bucket mismatch for ${entry.url}`);
  checkedRisks[bucket]++;
}
if (scanned.length !== counts.scanned || Object.keys(risks).some(key => risks[key] !== checkedRisks[key])) {
  throw new Error('The published totals must reconcile with the per-entry results.');
}
const uniqueContent = new Set(scanned.map(entry => entry.scanDigest)).size;
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(summary.generatedAt));
const fileName = `REMIT-01-RS-001_R1_PublicSkillScan_${date}.json.gz`;
const report = {
  schemaVersion: 1,
  scope: `${number(counts.attempted)} of ${number(counts.enumerated)} public sitemap entries were attempted. Remaining work was stopped at the user's request.`,
  inventorySources: ['https://www.skills.sh/sitemap-skills-1.xml', 'https://www.skills.sh/sitemap-skills-2.xml'],
  summary: { ...summary, uniqueContentScanned: uniqueContent },
  manifest,
  repositories,
};
const compressed = gzipSync(JSON.stringify(report), { level: 9 });
const reportPath = join(root, 'data', fileName);
mkdirSync(join(root, 'data'), { recursive: true });
if (existsSync(reportPath) && !readFileSync(reportPath).equals(compressed)) {
  throw new Error('Issued report already exists. Bump its revision before writing different results.');
}
writeFileSync(reportPath, compressed);
const publicSummary = {
  ...summary,
  uniqueContentScanned: uniqueContent,
  report: `/data/${fileName}`,
  reportSha256: createHash('sha256').update(compressed).digest('hex'),
};
writeFileSync(join(root, 'data', 'catalog-scan-summary.json'), JSON.stringify(publicSummary, null, 2) + '\n');

// This compact index is fetched only near the graph. Full evidence stays a separate download.
const sources = [...new Set(scanned.map(entry => entry.source))];
const ruleNames = [...new Set(scanned.flatMap(entry => Object.keys(entry.ruleCounts)))];
const sourceIds = new Map(sources.map((source, index) => [source, index]));
const ruleIds = new Map(ruleNames.map((rule, index) => [rule, index]));
// Row fields: name, source index, score, file count, finding count, partial flag, rule/count pairs.
const rows = scanned.map(entry => [entry.skillId, sourceIds.get(entry.source), entry.score,
  entry.filesScanned, entry.findingCount, entry.coverage === 'partial' ? 1 : 0,
  Object.entries(entry.ruleCounts).map(([rule, count]) => [ruleIds.get(rule), count])]);
writeFileSync(join(root, 'data', 'mesh-skills.json'), JSON.stringify({ version: 1, scannedAt: date, sources, ruleNames, rows }));

const indexPath = join(root, 'index.html');
let html = readFileSync(indexPath, 'utf8');
html = html.replace(/(<h2 id="mesh-title">).*?(<\/h2>)/, `$1${number(counts.scanned)} skill entries scanned.$2`);
html = html.replace(/(<div class="section-intro">\s*<h2 id="mesh-title">[\s\S]*?<p>).*?(<\/p>)/,
  `$1Measured file checks from the public skills.sh catalog, representing ${number(uniqueContent)} distinct scanned contents. Incomplete and skipped entries are disclosed below.$2`);
html = html.replace(/(data-mesh role="group" aria-label=")[^"]+/, `$1Illustrative network of ${number(counts.scanned)} statically scanned catalog entries`);
html = html.replace(/(data-mesh-fallback>).*?(<\/div>)/, `$1${number(counts.scanned)} catalog entries scanned$2`);
html = html.replace(/(data-mesh-status aria-live="polite">).*?(<\/span>)/, `$1All ${number(counts.scanned)} entries$2`);
html = html.replace(/(<figure class="mesh-figure[\s\S]*?<figcaption>).*?(<\/figcaption>)/,
  '$1Zoom in to reveal individual skills. Drag to pan, select a node for its audit, or search by name. Positions and connections are illustrative.$2');
for (const risk of Object.keys(risks)) {
  const row = new RegExp(`(data-risk="${risk}"[\\s\\S]*?--bar:)[^;]+(;[\\s\\S]*?<strong>)[^<]+(<\\/strong>)`);
  html = html.replace(row, `$1${(risks[risk] / counts.scanned * 100).toFixed(3)}%$2${number(risks[risk])}$3`);
}
html = html.replace(/(<p class="chart-note">).*?(<\/p>)/,
  `$1Select a score to highlight its nodes. Static file checks, ${date}. High scores flag patterns to review. All behavioral decisions remain unknown.$2`);
html = html.replace(/<script id="mesh-data" type="application\/json">[\s\S]*?<\/script>\s*/, '');
html = html.replace('      <div class="risk-chart"', `      <script id="mesh-data" type="application/json">${JSON.stringify({ counts: risks })}</script>\n      <div class="risk-chart"`);
html = html.replace(/<details class="evidence-detail catalog-method">[\s\S]*?<\/details>\s*/, '');
const method = `      <details class="evidence-detail catalog-method">\n        <summary>Scan coverage and method</summary>\n        <p>We enumerated ${number(counts.enumerated)} unique URLs from the two public skills.sh skill sitemaps. This is a public-catalog snapshot, not a claim to cover every skill held by the platform.</p>\n        <p>${number(counts.complete)} entries had complete file coverage, ${number(counts.partial)} were scanned with gaps, and ${number(counts.failed)} could not be resolved or scanned. Another ${number(summary.unattempted)} entries were skipped when the remaining work was stopped. The graph includes completed and partial scans from ${number(counts.attempted)} attempted entries. Unscanned entries are excluded from the risk totals.</p>\n        <p>Remit ${summary.scanner.version} checked ${summary.scanner.ruleCount} static rules against repository snapshots. Downloaded code was never executed. The evidence records source URLs, archive and file hashes, exclusions and every outcome.</p>\n        <p><a href="/data/${fileName}" download>Download the full scan evidence</a> · <a href="/data/catalog-scan-summary.json">Read the summary</a></p>\n      </details>\n`;
html = html.replace('      <details class="evidence-detail">', method + '      <details class="evidence-detail">');
writeFileSync(indexPath, html);
console.log(JSON.stringify({ ...counts, uniqueContent, riskCounts: risks, reportPath, compressedBytes: compressed.length }, null, 2));
