#!/usr/bin/env node

const { execSync } = require('node:child_process');

function git(cmd) {
  return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }).trim();
}

function getChangedFiles() {
  const staged = git('git diff --name-only --cached') || '';
  const unstaged = git('git diff --name-only') || '';
  return Array.from(new Set([...staged.split('\n'), ...unstaged.split('\n')].map((s) => s.trim()).filter(Boolean)));
}

function main() {
  const files = getChangedFiles();
  if (files.length === 0) {
    console.log('OK: no changes detected.');
    return;
  }

  const touchesApiCode = files.some(
    (f) =>
      f === 'server/index.js' ||
      f.startsWith('server/rest/')
  );
  const touchesOpenapi = files.includes('server/openapi.yaml');

  if (touchesApiCode && !touchesOpenapi) {
    console.error(
      'Potential OpenAPI drift: API code changed (server/index.js or server/rest/**) but server/openapi.yaml was not changed.\n' +
        'If the change affects any /api route, params, or response shape, update server/openapi.yaml.'
    );
    process.exit(1);
  }

  console.log('OK: no OpenAPI drift detected (heuristic).');
}

main();

