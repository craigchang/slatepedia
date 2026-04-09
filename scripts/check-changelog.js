#!/usr/bin/env node

const path = require('node:path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function isIsoDateTime(s) {
  if (typeof s !== 'string' || s.trim() === '') return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}

function isSemver3(s) {
  return typeof s === 'string' && /^\d+\.\d+\.\d+$/.test(s);
}

function cmpSemver(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

function main() {
  const changelogPath = path.resolve(__dirname, '../server/rest/changelog/data.js');
  // data.js is CommonJS exporting an array
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const entries = require(changelogPath);

  if (!Array.isArray(entries) || entries.length === 0) {
    fail('Changelog must export a non-empty array.');
  }

  const seenVersions = new Set();
  for (const [i, e] of entries.entries()) {
    if (!e || typeof e !== 'object') fail(`Entry #${i} is not an object.`);

    const keys = Object.keys(e).sort();
    const expected = ['date', 'message', 'title', 'version'];
    const hasExactlyExpected =
      keys.length === expected.length && expected.every((k, idx) => keys[idx] === expected[idx]);
    if (!hasExactlyExpected) {
      fail(
        `Entry #${i} must have exactly keys ${expected.join(', ')} (got: ${keys.join(', ')}).`
      );
    }

    if (!isSemver3(e.version)) fail(`Entry #${i} has invalid version: ${String(e.version)}`);
    if (!isIsoDateTime(e.date)) fail(`Entry #${i} has invalid date: ${String(e.date)}`);
    if (typeof e.title !== 'string') fail(`Entry #${i} title must be a string.`);
    if (typeof e.message !== 'string') fail(`Entry #${i} message must be a string.`);

    if (seenVersions.has(e.version)) fail(`Duplicate changelog version found: ${e.version}`);
    seenVersions.add(e.version);
  }

  // Display order convention: newest-first; version numbers should descend.
  for (let i = 1; i < entries.length; i++) {
    const prev = entries[i - 1].version;
    const cur = entries[i].version;
    if (cmpSemver(prev, cur) < 0) {
      fail(
        `Changelog versions appear out of order at index ${i - 1} -> ${i}: ${prev} then ${cur}. ` +
          'Expected newest-first (descending semver).'
      );
    }
  }

  console.log(`OK: changelog entries valid (${entries.length} entries).`);
}

main();

