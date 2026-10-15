// Export a Claude Code session transcript (.jsonl) to readable Markdown.
// Usage: node scripts/export-transcript.mjs <in.jsonl> <out.md>
// Dependency-free (Node 18+). Read-only on the input file.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error('Usage: node scripts/export-transcript.mjs <in.jsonl> <out.md>');
  process.exit(1);
}

// Blocks removed from user text (and from assistant text / tool prompts, for safety).
const STRIP_RE = /<(system-reminder|ide_opened_file|ide_selection|local-command-[\w-]+|command-[\w-]+)(\s[^>]*)?>[\s\S]*?<\/\1>/g;

// Redaction rules applied to the whole output.
const REDACT_LITERAL = [
  ['ggwpshnik27@gmail.com', '[e-mail]'],
  ['ggwpshnik', '[e-mail]'],
];
const REDACT_RE = [
  /xkeysib-[A-Za-z0-9-]{10,}/g,
  /xsmtpsib-[A-Za-z0-9-]{10,}/g,
  /sb_secret_[A-Za-z0-9_-]{10,}/g,
  /eyJhbGci[A-Za-z0-9_.-]{20,}/g,
  /phc_[A-Za-z0-9]{20,}/g,
  /sk-ant-[A-Za-z0-9_-]{10,}/g,
];

const COMPACT_PREFIX = 'This session is being continued';
const PROMPT_LIMIT = 4000;

const header = [
  '# Dvojče — kompletní přepis práce s AI (Claude Code, 13.–15. 10. 2026)',
  '',
  'Hlavní model Claude Opus 5.5 rozhoduje a ověřuje; kód a texty psali subagenti Claude Haiku 5.5. ' +
    'Volání nástrojů jsou zobrazena jako jednořádkové souhrny; systémové a kontextové vstupy jsou odstraněny.',
];

function stripBlocks(text) {
  return text.replace(STRIP_RE, '').trim();
}

function oneLine(s) {
  return String(s).replace(/\s+/g, ' ').trim();
}

function timeLabel(ts) {
  if (!ts) return '';
  return ts.slice(0, 16).replace('T', ' ') + ' UTC';
}

function contentItems(content) {
  if (typeof content === 'string') return [{ type: 'text', text: content }];
  return Array.isArray(content) ? content : [];
}

function fullUserText(items) {
  return items
    .map((i) => (i.type === 'text' ? i.text : null))
    .filter((t) => typeof t === 'string')
    .join('\n');
}

function renderUserParts(items) {
  const parts = [];
  for (const it of items) {
    if (it.type === 'text' && typeof it.text === 'string') {
      const t = stripBlocks(it.text);
      if (t) parts.push(t);
    } else if (it.type === 'image') {
      parts.push('[obrázek]');
    } else if (it.type === 'document') {
      parts.push('[dokument]');
    }
    // tool_result and anything else: nothing rendered
  }
  return parts;
}

function toolLines(item) {
  const input = item.input || {};
  if (item.name === 'Agent') {
    const model = input.model || 'default';
    const desc = oneLine(input.description || '');
    let out = `→ Agent (${model}) — ${desc}`;
    if (typeof input.prompt === 'string' && input.prompt.trim()) {
      let prompt = stripBlocks(input.prompt);
      let suffix = '';
      if (prompt.length > PROMPT_LIMIT) {
        prompt = prompt.slice(0, PROMPT_LIMIT);
        suffix = '\n[zkráceno]';
      }
      const fence = prompt.includes('```') ? '````' : '```';
      out +=
        '\n\n<details><summary>zadání pro subagenta</summary>\n\n' +
        `${fence}\n${prompt}${suffix}\n${fence}\n` +
        '</details>';
    }
    return out;
  }
  let short;
  if (['Read', 'Edit', 'Write'].includes(item.name) && input.file_path) {
    short = input.file_path;
  } else if (['Glob', 'Grep'].includes(item.name) && input.pattern) {
    short = input.pattern;
  } else if (input.description) {
    short = input.description;
  } else {
    short = JSON.stringify(input).slice(0, 120);
  }
  return `→ ${item.name}: ${oneLine(short)}`;
}

// Read and parse the session file.
const raw = readFileSync(inPath, 'utf8');
const entries = [];
for (const line of raw.split('\n')) {
  if (!line.trim()) continue;
  try {
    entries.push(JSON.parse(line));
  } catch {
    // skip malformed line
  }
}

// Build blocks: { kind: 'user'|'asst'|'note', id, ts, parts[] }
const blocks = [];
for (const e of entries) {
  if (e.isSidechain === true || e.isMeta === true) continue;
  if (e.type !== 'user' && e.type !== 'assistant') continue;
  const msg = e.message || {};
  const items = contentItems(msg.content);

  if (e.type === 'user') {
    const full = fullUserText(items).trimStart();
    if (full.startsWith(COMPACT_PREFIX)) {
      blocks.push({ kind: 'note', parts: ['_— kontext zkomprimován —_'] });
      continue;
    }
    const parts = renderUserParts(items);
    if (parts.length === 0) continue; // tool-result-only or empty after stripping
    blocks.push({ kind: 'user', ts: e.timestamp, parts });
    continue;
  }

  // assistant
  const parts = [];
  for (const it of items) {
    if (it.type === 'text' && typeof it.text === 'string') {
      const t = stripBlocks(it.text);
      if (t) parts.push(t);
    } else if (it.type === 'tool_use') {
      parts.push(toolLines(it));
    }
    // thinking and other types: skipped
  }
  if (parts.length === 0) continue;
  const last = blocks[blocks.length - 1];
  if (last && last.kind === 'asst' && last.id && last.id === msg.id) {
    last.parts.push(...parts);
  } else {
    blocks.push({ kind: 'asst', id: msg.id, ts: e.timestamp, parts });
  }
}

// Render Markdown.
const out = [...header, ''];
let userCount = 0;
let asstCount = 0;
for (const b of blocks) {
  if (b.kind === 'note') {
    out.push(b.parts[0], '');
    continue;
  }
  if (b.kind === 'user') {
    userCount++;
    out.push(`## 👤 Uživatel — ${timeLabel(b.ts)}`, '');
  } else {
    asstCount++;
    out.push('### 🤖 Claude', '');
  }
  for (const p of b.parts) out.push(p, '');
}

let text = out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
for (const [from, to] of REDACT_LITERAL) text = text.split(from).join(to);
for (const re of REDACT_RE) text = text.replace(re, '[REDACTED]');

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, text, 'utf8');

console.error(
  `wrote ${outPath}: ${Buffer.byteLength(text, 'utf8')} bytes, ${userCount} user sections, ${asstCount} assistant sections`,
);
