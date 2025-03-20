import os

def mostrar_estructura(directorio="."):
    for root, dirs, files in os.walk(directorio):
        # Excluir la carpeta node_modules
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        # Imprimir la carpeta actual
        print("Carpeta:", root)
        # Imprimir los nombres de los archivos en la carpeta actual
        for file in files:
            print("  Archivo:", file)
        print()

if __name__ == "__main__":
    mostrar_estructura()
