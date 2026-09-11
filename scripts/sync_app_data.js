#!/usr/bin/env node
/**
 * sync_app_data.js — 把「应用版」单文件 HTML 的内联数据同步为「网站」数据源
 *
 * 权威源（网站）:
 *   public/js/data.js      → PROGRAMS / TIERS / SCHOOLS（录取要求）
 *   public/js/rankings.js  → RANK_DATA（三大排行榜）
 * 目标（应用）:
 *   加拿大大学录取要求对照表_2026.html（内联同名数据块）
 *
 * 用法:
 *   node scripts/sync_app_data.js            # 同步（原地写入）
 *   node scripts/sync_app_data.js --check    # 只校验，不改文件
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APP_FILE = path.join(ROOT, '加拿大大学录取要求对照表_2026.html');
const WEB_DATA = path.join(ROOT, 'public/js/data.js');
const WEB_RANK = path.join(ROOT, 'public/js/rankings.js');
const CHECK_ONLY = process.argv.includes('--check');

/** 取 data.js 中的 PROGRAMS..SCHOOLS 数据块（不含文件末尾的更新日志注释） */
function extractSchoolsBlock(src) {
  const lines = src.split('\n');
  const start = lines.findIndex(l => l.startsWith('const PROGRAMS'));
  if (start < 0) throw new Error('data.js: 未找到 const PROGRAMS');
  let end = -1;
  for (let i = lines.length - 1; i >= start; i--) {
    if (lines[i].trim() === '};') { end = i; break; }
  }
  if (end < 0) throw new Error('data.js: 未找到 SCHOOLS 结束行');
  return lines.slice(start, end + 1).join('\n');
}

/** 取 rankings.js 中的 RANK_DATA 数据块 */
function extractRankBlock(src) {
  const lines = src.split('\n');
  const start = lines.findIndex(l => l.startsWith('const RANK_DATA'));
  if (start < 0) throw new Error('rankings.js: 未找到 const RANK_DATA');
  let end = -1;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].trim() === '};') { end = i; break; }
  }
  if (end < 0) throw new Error('rankings.js: 未找到 RANK_DATA 结束行');
  return lines.slice(start, end + 1).join('\n');
}

/** 用 block 替换 html 中 [startAnchor, endAnchor) 之间的内容 */
function replaceRegion(html, startAnchor, endAnchor, block, label) {
  const s = html.indexOf(startAnchor);
  if (s < 0) throw new Error('应用文件缺失起始锚点: ' + startAnchor);
  const e = html.indexOf(endAnchor, s);
  if (e < 0) throw new Error('应用文件缺失结束锚点: ' + endAnchor);
  const before = html.slice(s, e);
  if (before.trim() === block.trim()) {
    console.log(`  · ${label}: 已一致，无需改动`);
    return html;
  }
  console.log(`  · ${label}: 差异 ${before.split('\n').length} 行 → 替换为 ${block.split('\n').length} 行`);
  return html.slice(0, s) + block + '\n\n' + html.slice(e + 1);
}

const schoolsBlock = extractSchoolsBlock(fs.readFileSync(WEB_DATA, 'utf8'));
const rankBlock = extractRankBlock(fs.readFileSync(WEB_RANK, 'utf8'));

let html = fs.readFileSync(APP_FILE, 'utf8');
const original = html;

console.log('同步 应用版 ← 网站数据源');
html = replaceRegion(html, 'const PROGRAMS = {', '\nlet currentTab', schoolsBlock, 'PROGRAMS/TIERS/SCHOOLS');
html = replaceRegion(html, 'const RANK_DATA = {', '\nconst RANK_PROGS', rankBlock, 'RANK_DATA');

if (CHECK_ONLY) {
  console.log(html === original ? '\n[check] 应用版数据与网站数据源一致 ✅' : '\n[check] 应用版数据与网站数据源不一致 ❌');
  process.exit(html === original ? 0 : 1);
}

if (html === original) {
  console.log('\n文件无需改动。');
} else {
  fs.writeFileSync(APP_FILE, html, 'utf8');
  console.log('\n已写入 ' + path.relative(ROOT, APP_FILE));
}
