const fs = require('fs');
const path = require('path');
const src = path.resolve(__dirname, '..', 'src', 'app', 'Core');
const dest = path.resolve(__dirname, '..', 'src', 'app', 'core');

if (!fs.existsSync(src)) {
  console.error('Source Core folder not found:', src);
  process.exit(1);
}
if (fs.existsSync(dest)) {
  console.log('Destination already exists:', dest);
  process.exit(0);
}

try {
  fs.cpSync(src, dest, { recursive: true });
  console.log('Copied', src, '->', dest);
  // remove original directory
  const rimraf = (p) => {
    if (!fs.existsSync(p)) return;
    for (const entry of fs.readdirSync(p)) {
      const full = path.join(p, entry);
      if (fs.lstatSync(full).isDirectory()) rimraf(full);
      else fs.unlinkSync(full);
    }
    fs.rmdirSync(p);
  };
  rimraf(src);
  console.log('Removed original', src);
} catch (e) {
  console.error('Error:', e);
  process.exit(1);
}
