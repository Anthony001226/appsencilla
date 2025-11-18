// index.js
const express = require('express');
const path = require('path');
const { Pool } = require('pg'); // Cliente de PostgreSQL
const app = express();
    
// Puerto asignado por Render o 3000 localmente
const PORT = process.env.PORT || 3000;

// Configuración de la Base de Datos
// Utiliza la variable de entorno DATABASE_URL que configuraste en Render
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // NECESARIO para que Render funcione con PostgreSQL de forma segura
    ssl: {
        rejectUnauthorized: false
    }
});

// 1. API Endpoint de Prueba de Base de Datos
app.get('/api/db-test', async (req, res) => {
    try {
        // Ejecuta una consulta simple para verificar la conexión
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() AS now');
        client.release(); // Libera la conexión
        
        res.json({ 
            success: true, 
            message: '¡Conexión a PostgreSQL exitosa!',
            currentTime: result.rows[0].now 
        });

    } catch (err) {
        console.error("Error al conectar con la DB:", err);
        res.status(500).json({ 
            success: false, 
            message: 'Error al conectar con la base de datos', 
            error: err.message 
        });
    }
});


// 2. API Endpoint del mensaje (como antes)
app.get('/api/mensaje', (req, res) => {
    res.json({ texto: '¡Hola desde el Backend en Express!' });
});



// Verifica que la carpeta exista antes de servirla
// if (fs.existsSync(angularPath)) { // Puedes descomentar esto para debug local
const angularPath = path.join(__dirname, 'frontend', 'dist', 'frontend', 'browser'); 
app.use(express.static(angularPath)); // Esto sirve la carpeta estática

app.use((req, res, next) => {
    // Para manejar rutas de Angular (como /about, /users, etc.)
    // Si la ruta no fue manejada por la API o los archivos estáticos anteriores, 
    // se envía siempre el index.html de Angular.
    res.sendFile(path.join(angularPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});