// subirNoticias.js (NO React, SOLO Node.js)
const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

// --- CONFIGURACIÓN FIREBASE ADMIN ---
// Asegurate de tener el archivo de credenciales en la misma carpeta, o ajustá la ruta si está en otro lado
const serviceAccount = require('./serviceAccountKey.json'); // <-- Cambia el nombre si tu archivo es otro

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

// --- LEE EL ARCHIVO DE NOTICIAS ---
const noticiasPath = path.join(__dirname, '../assets/noticias.json');
const noticias = JSON.parse(fs.readFileSync(noticiasPath, 'utf8'));

// --- SUBE LAS NOTICIAS ---
async function subirNoticias() {
  for (const noticia of noticias) {
    await db.collection('news').add({
      ...noticia,
      createdAt: Timestamp.now(),
    });
    console.log('Noticia subida:', noticia.title);
  }
  console.log('¡Listo! Todas las noticias subidas.');
}

subirNoticias();
