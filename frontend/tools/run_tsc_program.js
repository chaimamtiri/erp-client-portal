const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const configPath = path.resolve(__dirname, '..', 'tsconfig.json');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath));
console.log('Parsed files count:', parsed.fileNames.length);
try {
  const program = ts.createProgram(parsed.fileNames, parsed.options);
  console.log('Created program with', program.getSourceFiles().length, 'source files.');
  const diags = ts.getPreEmitDiagnostics(program);
  console.log('Diagnostics count:', diags.length);
} catch (e) {
  console.error('Error during diagnostics:', e && e.stack ? e.stack : e);
}
