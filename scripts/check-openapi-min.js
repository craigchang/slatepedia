#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function main() {
  const specPath = path.resolve(__dirname, '../server/openapi.yaml');
  if (!fs.existsSync(specPath)) fail('Missing server/openapi.yaml');

  const text = fs.readFileSync(specPath, 'utf8');
  const hasOpenapi = /^\s*openapi:\s*3\./m.test(text);
  const hasInfo = /^\s*info:\s*$/m.test(text);
  const hasPaths = /^\s*paths:\s*$/m.test(text);
  const hasChangelog = /^\s*\/changelog:\s*$/m.test(text);

  if (!hasOpenapi) fail('openapi.yaml missing `openapi: 3.x` header.');
  if (!hasInfo) fail('openapi.yaml missing `info:` block.');
  if (!hasPaths) fail('openapi.yaml missing `paths:` block.');
  if (!hasChangelog) fail('openapi.yaml missing `/changelog` path (expected for this project).');

  console.log('OK: openapi.yaml basic checks passed.');
}

main();

