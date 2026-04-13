#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Map of hex colors -> CSS variable names (must match variables added into theme.css)
const map = {
  '#06b6d4': '--color-accent-blue',
  '#0ea5e9': '--color-sky',
  '#84cc16': '--color-success-light',
  '#65a30d': '--color-success-600',
  '#bef264': '--color-success-200',
  '#f97316': '--color-warning-dark',
  '#f59e0b': '--color-warning',
  '#10b981': '--color-teal',
  '#8b5cf6': '--color-purple',
  '#ec4899': '--color-pink',
  '#6366f1': '--color-indigo-600',
  '#ef4444': '--color-danger',
  '#f43f5e': '--color-danger-light',
  '#be123c': '--color-danger-700',
  '#fda4af': '--color-danger-200',
  '#f1f5f9': '--color-neutral-100',
  '#f0f0f0': '--color-neutral-200',
  '#1e293b': '--color-neutral-900',
  '#ffffff': '--color-white',
  '#94a3b8': '--color-muted-1',
  '#4f46e5': '--color-indigo-500',
  '#818cf8': '--color-indigo-400'
};

function replaceInFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace exact hex occurrences (case-insensitive)
  for (const [hex, varName] of Object.entries(map)) {
    const re = new RegExp(hex, 'ig');
    if (re.test(content)) {
      content = content.replace(re, `var(${varName})`);
      changed = true;
    }
  }

  // Replace rgb(...) occurrences common in boxShadow strings -> leave as-is for now

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    return true;
  }
  return false;
}

function run() {
  const root = path.resolve(__dirname, '..');
  const pattern = path.join(root, 'src', '**', '*.{ts,tsx,js,jsx,css,svg,html}');
  const files = glob.sync(pattern, { nodir: true });

  const modified = [];
  files.forEach((f) => {
    try {
      if (replaceInFile(f)) modified.push(path.relative(root, f));
    } catch (err) {
      console.error('Failed to process', f, err);
    }
  });

  console.log(`Processed ${files.length} files. Modified: ${modified.length}`);
  if (modified.length) console.log(modified.join('\n'));
}

if (require.main === module) run();
