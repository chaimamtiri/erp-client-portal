const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..', 'src', 'app');
const src = path.join(dir, 'Core');
const tmp = path.join(dir, 'Core_temp_12345');
const dest = path.join(dir, 'core');
try {
  if (!fs.existsSync(src)) { console.error('src not exists', src); process.exit(1); }
  if (fs.existsSync(tmp)) { fs.rmSync(tmp, { recursive: true, force: true }); }
  fs.renameSync(src, tmp);
  console.log('renamed to tmp');
  if (fs.existsSync(dest)) { fs.rmSync(dest, { recursive: true, force: true }); }
  fs.renameSync(tmp, dest);
  console.log('renamed tmp to dest');
} catch (e) {
  console.error('error', e);
  process.exit(1);
}
