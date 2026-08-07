from pathlib import Path
import re

root = Path("src/app")
updated_files = []

replacements = [
    (re.compile(r"from\s+(['\"])(\./|\.\./|\.\./\.\./)Core/Guards/"), r"from \1\2guards/"),
    (re.compile(r"from\s+(['\"])(\./|\.\./|\.\./\.\./)Core/interceptors/"), r"from \1\2core/interceptors/"),
    (re.compile(r"from\s+(['\"])(\./|\.\./|\.\./\.\./)Core/services/"), r"from \1\2core/services/"),
    (re.compile(r"from\s+(['\"])(\./|\.\./|\.\./\.\./)Core/models/"), r"from \1\2core/models/"),
    (re.compile(r"from\s+(['\"])(\./|\.\./|\.\./\.\./)Core/"), r"from \1\2core/"),
]

for path in root.rglob("*.ts"):
    text = path.read_text(encoding="utf-8")
    new_text = text

    for pattern, replacement in replacements:
        new_text = pattern.sub(replacement, new_text)

    if "@Component({" in new_text and "imports:" in new_text and "standalone:" not in new_text:
        lines = new_text.splitlines()
        out_lines = []
        inserted = False
        in_component = False

        for line in lines:
            out_lines.append(line)
            if "@Component({" in line:
                in_component = True
            elif in_component and not inserted and line.strip().startswith("selector:"):
                out_lines.append("  standalone: true,")
                inserted = True
            elif in_component and line.strip() == "}":
                in_component = False

        new_text = "\n".join(out_lines)

    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        updated_files.append(str(path))

print(f"UPDATED {len(updated_files)} files")
for file_path in updated_files:
    print(file_path)
