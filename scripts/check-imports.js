import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as parser from '@babel/parser';
import traverseModule from '@babel/traverse';

const traverse = traverseModule.default || traverseModule;

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

for (const filePath of allFiles) {
  const code = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx'],
    });
  } catch (err) {
    // Syntax error will be caught by Vite anyway
    continue;
  }

  traverse(ast, {
    JSXOpeningElement(nodePath) {
      const nameNode = nodePath.node.name;
      let tagName = null;

      if (nameNode.type === 'JSXIdentifier') {
        tagName = nameNode.name;
      }

      // We only care about Capitalized JSX tags (components/icons)
      if (tagName && /^[A-Z]/.test(tagName)) {
        const binding = nodePath.scope.getBinding(tagName);
        const hasGlobal = nodePath.scope.hasGlobal(tagName);

        if (!binding && !hasGlobal) {
          const relPath = path.relative(path.join(__dirname, '..'), filePath);
          missingReport.push({
            file: relPath,
            missingTag: tagName,
            line: nameNode.loc ? nameNode.loc.start.line : 0,
          });
        }
      }
    },
  });
}

if (missingReport.length > 0) {
  console.error('\n❌ BUILD FAILED: Unimported JSX symbols detected!');
  for (const item of missingReport) {
    console.error(`  - ${item.file}:${item.line}: <${item.missingTag}> is used but not imported!`);
  }
  process.exit(1);
} else {
  console.log('✅ AST Import Validation Passed: All JSX components & icons are cleanly imported across the codebase.');
}
