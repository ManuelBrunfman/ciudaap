import os
import json

# Ruta al JSON del proyecto corregido
json_path = "proyecto_corregido.json"

# Cargar el contenido del JSON
with open(json_path, "r", encoding="utf-8") as file:
    project_data = json.load(file)

def create_project_structure(base_path, files):
    for name, content in files.items():
        path = os.path.join(base_path, name)
        
        if isinstance(content, dict) and "files" in content:
            # Es una carpeta, crearla y procesar sus archivos
            os.makedirs(path, exist_ok=True)
            create_project_structure(path, content["files"])
        else:
            # Es un archivo, escribir su contenido
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
                
# Ruta del nuevo proyecto
new_project_path = "NuevoProyectoCorregido"
os.makedirs(new_project_path, exist_ok=True)

# Crear la estructura del proyecto
create_project_structure(new_project_path, project_data["files"])

print(f"Proyecto corregido generado en: {new_project_path}")