const fs = require('fs');
const path = require('path');

function recorrerDirectorio(dir) {
  const resultado = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      resultado.push({
        name: item,
        type: 'directory',
        contents: recorrerDirectorio(fullPath),
      });
    } else {
      resultado.push({
        name: item,
        type: 'file',
        content: fs.readFileSync(fullPath, 'utf8'),
      });
    }
  }
  return resultado;
}

// Cambiá './' por la ruta raíz de tu proyecto si querés
const estructura = {
  name: 'mi_proyecto',
  type: 'directory',
  contents: recorrerDirectorio('./'),
};

fs.writeFileSync('proyecto_completo.json', JSON.stringify(estructura, null, 2), 'utf8');

console.log('¡Listo! Proyecto convertido a JSON completo.');
