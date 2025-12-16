#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const lcovPath = path.join(process.cwd(), 'coverage', 'lcov.info');

if (fs.existsSync(lcovPath)) {
  let content = fs.readFileSync(lcovPath, 'utf8');
  const original = content;

  // Convert Windows backslashes to forward slashes in file paths
  // Replace all backslashes with forward slashes
  content = content.split('\\').join('/');

  if (content !== original) {
    fs.writeFileSync(lcovPath, content, 'utf8');
    console.log('Fixed lcov.info paths: converted backslashes to forward slashes');
  } else {
    console.log('lcov.info already has forward slashes');
  }
} else {
  console.log('lcov.info not found, skipping path fix');
}
