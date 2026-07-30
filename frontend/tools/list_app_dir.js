const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..', 'src', 'app');
const entries = fs.readdirSync(dir, { withFileTypes: true }).map(d => ({name: d.name, isDir: d.isDirectory()}));
fs.writeFileSync(path.resolve(__dirname, 'app_dir.json'), JSON.stringify(entries, null, 2));
console.log('Wrote app_dir.json');
