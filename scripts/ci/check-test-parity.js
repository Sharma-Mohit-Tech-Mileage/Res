#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();

const run = (command) =>
  execSync(command, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();

const safeRun = (command) => {
  try {
    return run(command);
  } catch (error) {
    return '';
  }
};

const normalize = (p) => p.replace(/\\/g, '/');

const getBaseRef = () => {
  const githubBase = process.env.GITHUB_BASE_REF;
  if (githubBase) {
    return `origin/${githubBase}`;
  }

  const azureTarget = process.env.SYSTEM_PULLREQUEST_TARGETBRANCH;
  if (azureTarget) {
    const branchName = azureTarget.replace('refs/heads/', '');
    return `origin/${branchName}`;
  }

  return 'origin/main';
};

const listTestFiles = () => {
  const output = safeRun("git ls-files '__tests__/**/*.test.js' '__tests__/**/*.test.ts' '__tests__/**/*.test.tsx'");
  return output ? output.split('\n').map(normalize).filter(Boolean) : [];
};

const readAllTestContent = (testFiles) =>
  testFiles
    .map((file) => {
      const abs = path.join(repoRoot, file);
      if (!fs.existsSync(abs)) return '';
      return fs.readFileSync(abs, 'utf8');
    })
    .join('\n\n');

const listAddedModules = (baseRef) => {
  const cmd = `git diff --name-status --diff-filter=A ${baseRef}...HEAD -- src/network/apis src/components`;
  const output = safeRun(cmd);
  if (!output) return [];

  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/\s+/).slice(1).join(' '))
    .map(normalize)
    .filter((file) => file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx'))
    .filter(
      (file) =>
        file.startsWith('src/network/apis/') ||
        (file.startsWith('src/components/') && /Screen\.(js|ts|tsx)$/.test(file))
    );
};

const hasTestReference = (modulePath, testFiles, allTestContent) => {
  const noExt = modulePath.replace(/\.(js|ts|tsx)$/, '');
  const base = path.basename(noExt);

  const filePattern = new RegExp(`${base}\\.test\\.(js|ts|tsx)$`);
  const hasNamedTestFile = testFiles.some((t) => filePattern.test(path.basename(t)));
  if (hasNamedTestFile) return true;

  if (allTestContent.includes(modulePath) || allTestContent.includes(noExt) || allTestContent.includes(base)) {
    return true;
  }

  return false;
};

const main = () => {
  const baseRef = getBaseRef();
  const testFiles = listTestFiles();
  const allTestContent = readAllTestContent(testFiles);

  const addedModules = listAddedModules(baseRef);

  if (addedModules.length === 0) {
    console.log('No newly added API or screen modules detected; parity gate passed.');
    process.exit(0);
  }

  const missing = addedModules.filter(
    (modulePath) => !hasTestReference(modulePath, testFiles, allTestContent)
  );

  if (missing.length > 0) {
    console.error('Missing tests for newly added modules:');
    missing.forEach((m) => console.error(`- ${m}`));
    console.error('Add or update tests under __tests__ to cover each new API/screen module.');
    process.exit(1);
  }

  console.log('API/screen test parity gate passed for newly added modules.');
};

main();
