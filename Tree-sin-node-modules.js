#!/usr/bin/env node
/**
 * tree-sin-node-modules.js
 * -------------------------------------------
 * Genera un listado estilo "tree" de la estructura de carpetas/archivos
 * excluyendo por completo cualquier directorio llamado "node_modules".
 *
 * USO BÁSICO
 *   node tree-sin-node-modules.js                # profundidad 3, ruta actual
 *   node tree-sin-node-modules.js --depth=2      # hasta 2 niveles
 *   node tree-sin-node-modules.js --path=D:\\proyecto --out=estructura.txt
 *
 * OPCIONES (via CLI)
 *   --path=<ruta>    Ruta raíz (default ".")
 *   --depth=<num>    Profundidad máxima (default 3)
 *   --out=<archivo>  Si se indica, escribe la salida en el archivo UTF‑8 dado
 *
 * Compatible con Node >= 14 (no requiere dependencias externas).
 * -------------------------------------------
 */

const fs = require("fs");
const path = require("path");

// ----------------------
// PARSEO DE ARGUMENTOS
// ----------------------
const args = process.argv.slice(2);
let rootPath = ".";
let maxDepth = 3;
let outFile = null;

for (const arg of args) {
  if (arg.startsWith("--path=")) {
    rootPath = arg.substring("--path=".length);
  } else if (arg.startsWith("--depth=")) {
    maxDepth = parseInt(arg.substring("--depth=".length), 10);
  } else if (arg.startsWith("--out=")) {
    outFile = arg.substring("--out=".length);
  }
}

rootPath = path.resolve(rootPath);
const lines = [];

// ----------------------
// FUNCIÓN RECURSIVA
// ----------------------
function buildTree(currentPath, depth, prefix = "") {
  if (depth < 0) return;

  // Listar hijos, excluyendo node_modules; carpetas primero
  const entries = fs
    .readdirSync(currentPath, { withFileTypes: true })
    .filter((dirent) => dirent.name !== "node_modules")
    .sort((a, b) => {
      // Carpetas antes que archivos; luego alfabéticamente
      if (a.isDirectory() !== b.isDirectory()) {
        return a.isDirectory() ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const line = `${prefix}${connector}${entry.name}`;
    lines.push(line);

    if (entry.isDirectory()) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      buildTree(path.join(currentPath, entry.name), depth - 1, newPrefix);
    }
  });
}

// Construir árbol
buildTree(rootPath, maxDepth);

// Salida
if (outFile) {
  fs.writeFileSync(outFile, lines.join("\n"), "utf8");
  console.log(`Estructura guardada en ${outFile}`);
} else {
  console.log(lines.join("\n"));
}
