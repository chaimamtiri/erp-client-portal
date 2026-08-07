from pathlib import Path
import shutil
from filecmp import cmp

root = Path('c:/Users/msi/Documents/Projects/stage/frontend')
app_dir = root / 'src' / 'app'
core_upper = app_dir / 'Core'
core_lower = app_dir / 'core'

if not core_upper.exists():
    print('Uppercase Core does not exist')
    raise SystemExit(1)

core_lower.mkdir(parents=True, exist_ok=True)

for src in core_upper.rglob('*'):
    if src.is_file():
        rel = src.relative_to(core_upper)
        dest = core_lower / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        if not dest.exists() or not cmp(src, dest, shallow=False):
            shutil.copy2(src, dest)
            print('COPIED', src, '->', dest)

for ts_path in app_dir.rglob('*.ts'):
    text = ts_path.read_text(encoding='utf-8')
    new_text = text.replace('Core/', 'core/')
    if new_text != text:
        ts_path.write_text(new_text, encoding='utf-8')
        print('REPLACED IMPORT PATHS IN', ts_path)

# fix auth guard import path
auth_guard = app_dir / 'guards' / 'auth.guard.ts'
if auth_guard.exists():
    text = auth_guard.read_text(encoding='utf-8')
    new_text = text.replace("import { AuthService } from '../services/auth.service';", "import { AuthService } from '../core/services/auth.service';")
    if new_text != text:
        auth_guard.write_text(new_text, encoding='utf-8')
        print('FIXED auth.guard import')

login_comp = app_dir / 'pages' / 'login' / 'login.component.ts'
if login_comp.exists():
    text = login_comp.read_text(encoding='utf-8')
    new_text = text.replace("this.backendErrors.set(['Une erreur inconnue est survenue lors de l'inscription.']);", "this.backendErrors.set(['Une erreur inconnue est survenue lors de l\\'inscription.']);")
    if new_text != text:
        login_comp.write_text(new_text, encoding='utf-8')
        print('FIXED login component quote')

print('done')
