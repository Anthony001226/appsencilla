// index.js
const express = require('express');
const path = require('path');
const app = express();

// Puerto asignado por Render o 3000 localmente
const PORT = process.env.PORT || 3000;

// 1. API Endpoints (Backend)
app.get('/api/mensaje', (req, res) => {
    res.json({ texto: '¡Hola desde el Backend en Express!' });
});

// 2. Servir archivos estáticos de Angular (Frontend)
// NOTA: Asegúrate de que la ruta coincida con tu build de Angular
// En Angular 17+ suele ser: frontend/dist/frontend/browser
const angularPath = path.join(__dirname, 'frontend', 'dist', 'frontend', 'browser');

app.use(express.static(angularPath));

// 3. Redirigir cualquier otra ruta al index.html de Angular
app.get('*', (req, res) => {
    res.sendFile(path.join(angularPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});