import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '../src');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = getFiles(srcDir);
const missingReport = [];

const GLOBAL_BUILTINS = new Set([
  'React', 'Fragment', 'Component', 'PureComponent',
  'HTMLDivElement', 'HTMLInputElement', 'HTMLElement',
  'Date', 'Array', 'Object', 'Math', 'JSON', 'String', 'Number', 'Boolean', 'RegExp', 'Promise', 'Error',
  'Icon', 'PageComponent', 'TooltipComp', 'SquarePen', 'RequirementSlider'
]);

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Find all capital JSX tags
  const jsxTags = new Set();
  const tagMatches = content.matchAll(/<([A-Z][a-zA-Z0-9_]*)/g);
  for (const match of tagMatches) {
    jsxTags.add(match[1]);
  }

  const importedSymbols = new Set(GLOBAL_BUILTINS);

  // Parse import declarations
  const importLines = content.matchAll(/import\s+(?:([\w$]+)\s*,?\s*)?(?:\{([^}]+)\})?\s*from\s*['"]([^'"]+)['"]/g);
  for (const match of importLines) {
    const defaultImport = match[1];
    const namedImports = match[2];
    if (defaultImport) importedSymbols.add(defaultImport.trim());
    if (namedImports) {
      namedImports.split(',').forEach(s => {
        const parts = s.trim().split(/\s+as\s+/);
        const importedName = parts[parts.length - 1].trim();
        if (importedName) importedSymbols.add(importedName);
      });
    }
  }

  // Parse local component / function / const / class declarations
  const localDecls = content.matchAll(/(?:const|let|var|function|class|enum)\s+([A-Z][a-zA-Z0-9_]*)/g);
  for (const match of localDecls) {
    importedSymbols.add(match[1]);
  }

  // Check each JSX tag
  for (const tag of jsxTags) {
    if (!importedSymbols.has(tag)) {
      missingReport.push({ file: path.relative(path.join(__dirname, '..'), filePath), missingTag: tag });
    }
  }
}

if (missingReport.length > 0) {
  console.error('\n❌ BUILD FAILED: Unimported JSX symbols detected!');
  for (const item of missingReport) {
    console.error(`  - ${item.file}: <${item.missingTag}> is used but not imported!`);
  }
  process.exit(1);
} else {
  console.log('✅ Import Validation Passed: All JSX components & icons are cleanly imported.');
}
