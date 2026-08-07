from pathlib import Path
import shutil

root = Path('c:/Users/msi/Documents/Projects/stage/frontend')
app = root / 'src' / 'app'
core_upper = app / 'Core'
core_lower = app / 'core'

if not core_upper.exists():
    raise FileNotFoundError(f'Missing source directory: {core_upper}')

core_lower.mkdir(parents=True, exist_ok=True)
for path in core_upper.rglob('*'):
    if path.is_file():
        relative = path.relative_to(core_upper)
        destination = core_lower / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, destination)
        print(f'COPIED {path} -> {destination}')

replacements = {
    'Core/': 'core/',
    "import { AuthService } from '../services/auth.service';": "import { AuthService } from '../core/services/auth.service';",
    "this.backendErrors.set(['Une erreur inconnue est survenue lors de l'inscription.']);": "this.backendErrors.set(['Une erreur inconnue est survenue lors de l\'inscription.']);"
}
for ts_path in app.rglob('*.ts'):
    text = ts_path.read_text(encoding='utf-8')
    new_text = text
    for old, new in replacements.items():
        new_text = new_text.replace(old, new)
    if new_text != text:
        ts_path.write_text(new_text, encoding='utf-8')
        print(f'UPDATED {ts_path}')

print('done')
