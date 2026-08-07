from pathlib import Path
import subprocess

root = Path('c:/Users/msi/Documents/Projects/stage/frontend')
app = root / 'src' / 'app'
core_lower = app / 'core'
core_lower.mkdir(parents=True, exist_ok=True)

# Restore tracked uppercase Core paths into lowercase core.
pathspecs = [
    'src/app/Core/interceptors',
    'src/app/Core/models',
    'src/app/Core/services'
]
files = []
for spec in pathspecs:
    output = subprocess.check_output(['git', 'ls-files', spec], text=True)
    for line in output.splitlines():
        if line.strip():
            files.append(line.strip())

if not files:
    raise SystemExit('No files found in git path src/app/Core')

for git_path in sorted(files):
    dest_path = Path(git_path.replace('src/app/Core/', 'src/app/core/'))
    dest = root / dest_path
    dest.parent.mkdir(parents=True, exist_ok=True)
    content = subprocess.check_output(['git', 'show', f'HEAD:{git_path}'], text=True)
    dest.write_text(content, encoding='utf-8')
    print(f'WROTE {dest}')

# Normalize import paths and other case-sensitive references.
for ts_path in app.rglob('*.ts'):
    text = ts_path.read_text(encoding='utf-8')
    new_text = text.replace('Core/', 'core/')
    if new_text != text:
        ts_path.write_text(new_text, encoding='utf-8')
        print(f'UPDATED IMPORTS IN {ts_path}')

print('restore complete')
