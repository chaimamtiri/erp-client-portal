const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (/\.ts$/.test(file)) results.push(file);
    }
  });
  return results;
}

const root = path.resolve(__dirname, '..', 'src');
const files = walk(root);
let problems = 0;
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const sf = ts.createSourceFile(f, text, ts.ScriptTarget.ESNext, /*setParentNodes*/ true);
  if (sf.referencedFiles && sf.referencedFiles.length) {
    sf.referencedFiles.forEach((r, i) => {
      if (!r || !r.fileName || typeof r.pos !== 'number' || typeof r.end !== 'number') {
        console.log('Malformed reference in', f, 'index', i, 'entry=', JSON.stringify(r));
        problems++;
      }
    });
  }
}
if (problems === 0) console.log('No malformed referencedFiles found.');
else console.log('Found', problems, 'malformed referencedFiles entries.');
