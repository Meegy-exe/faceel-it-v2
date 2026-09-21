import os
import re


def generate_codemap():
    client_src = "client/src"
    codemap_path = "docs/CODEMAP.md"

    output = "# CodeMap Automatique — Dépendances Frontend\n\n"
    output += "*Généré automatiquement par le script de cartographie.*\n\n"

    if not os.path.exists(client_src):
        print(f"Dossier {client_src} introuvable.")
        return

    for root, dirs, files in os.walk(client_src):
        for file in files:
            if file.endswith((".ts", ".vue")):
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, client_src)

                imports = []
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()
                        # Trouve les lignes d'import
                        found_imports = re.findall(r'import.*?from\s+[\'"]([^\'"]+)[\'"]', content)
                        imports = [imp for imp in found_imports if imp.startswith("@/") or imp.startswith("./")]
                except Exception as e:
                    continue

                if imports:
                    output += f"### `src/{rel_path}`\n"
                    for imp in imports:
                        output += f" ├─→ `{imp}`\n"
                    output += "\n"

    with open(codemap_path, "w", encoding="utf-8") as f:
        f.write(output)
    print(f"✅ CodeMap mis à jour avec succès dans {codemap_path}")


if __name__ == "__main__":
    generate_codemap()