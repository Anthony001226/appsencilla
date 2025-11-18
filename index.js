// index.js

const express = require('express');
const path = require('path');
const { Pool } = require('pg'); 
const app = express();
    
// Puerto asignado por Render o 3000 localmente
const PORT = process.env.PORT || 3000;

// Configuración de la Base de Datos
// Utiliza la variable de entorno DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // NECESARIO para que Render funcione con PostgreSQL de forma segura
    ssl: {
        rejectUnauthorized: false
    }
});

// MIDDLEWARE
// 1. Permite a Express parsear cuerpos de petición JSON (necesario para POST/PUT)
app.use(express.json());


// ----------------------------------------------------
// 2. API ENDPOINTS (BACKEND)
// ----------------------------------------------------

// Endpoint de prueba simple
app.get('/api/mensaje', (req, res) => {
    res.json({ texto: '¡Hola desde el Backend en Express!' });
});

// Endpoint de prueba de conexión a Base de Datos
app.get('/api/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() AS now');
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


// CRUD: LECTURA (GET todos los registros)
app.get('/api/tareas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tareas ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener tareas:", err);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener las tareas.' 
        });
    }
});


// ----------------------------------------------------
// 3. SERVIR EL FRONTEND (ANGULAR)
// ----------------------------------------------------

// Define la ruta donde Express encontrará los archivos de Angular
const angularPath = path.join(__dirname, 'frontend', 'dist', 'frontend', 'browser');

// Middleware para servir los archivos estáticos de Angular
app.use(express.static(angularPath));

// Middleware de fallback: Para cualquier ruta no manejada por la API, 
// se envía el index.html de Angular, permitiendo el routing del lado del cliente.
app.use((req, res, next) => {
    // Solo enviar si no es una petición de archivo o API ya manejada
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(angularPath, 'index.html'));
    } else {
        next();
    }
});


// ----------------------------------------------------
// 4. INICIAR EL SERVIDOR
// ----------------------------------------------------
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});