#!/usr/bin/env node

const { execSync } = require('node:child_process');

function git(cmd) {
  return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }).trim();
}

function getChangedFiles() {
  // Include staged and unstaged, ignore deletions for this check.
  const staged = git('git diff --name-only --cached --diff-filter=ACMRTUXB') || '';
  const unstaged = git('git diff --name-only --diff-filter=ACMRTUXB') || '';
  return Array.from(new Set([...staged.split('\n'), ...unstaged.split('\n')].map((s) => s.trim()).filter(Boolean)));
}

function isBlocked(path) {
  return (
    path === 'node_modules' ||
    path.startsWith('node_modules/') ||
    path === 'react-ui/node_modules' ||
    path.startsWith('react-ui/node_modules/') ||
    path === 'react-ui/build' ||
    path.startsWith('react-ui/build/')
  );
}

function main() {
  const files = getChangedFiles();
  const blocked = files.filter(isBlocked);

  if (blocked.length > 0) {
    console.error('Blocked changes detected (generated/dependency artifacts):');
    for (const f of blocked) console.error(`- ${f}`);
    console.error('\nRemove these changes before proceeding.');
    process.exit(1);
  }

  console.log('OK: no generated/dependency artifacts changed.');
}

main();

