/* global process */

import express from 'express';
import mysql from 'mysql2/promise';
import session from 'express-session';

const app = express();
const PORT = 3000;

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'chachichas',
    waitForConnections: true,
    connectionLimit: 10
});

app.use(express.json());

app.use(session({
    name: 'chachichas.sid',
    secret: process.env.SESSION_SECRET || 'solo-desarrollo-cambiar',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 8
    }
}));

// Comprobar API
app.get('/api', (req, res) => {
    res.json({ mensaje: 'API de Chachichas funcionando' });
});

// Iniciar sesión
app.post('/api/login', async (req, res) => {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({
                mensaje: 'Completa todos los campos.'
            });
        }

        const [filas] = await db.execute(
            `SELECT pk_usuario, nombre, usuario, rol
             FROM usuarios
             WHERE usuario = ? AND pass = ? AND estado = 1
             LIMIT 1`,
            [usuario, password]
        );

        if (filas.length === 0) {
            return res.status(401).json({
                mensaje: 'Usuario o contraseña incorrectos.'
            });
        }

        const cuenta = filas[0];

        const usuarioSesion = {
            id: cuenta.pk_usuario,
            nombre: cuenta.nombre,
            usuario: cuenta.usuario,
            rol: cuenta.rol
        };

        req.session.regenerate((error) => {
            if (error) {
                return res.status(500).json({
                    mensaje: 'No se pudo iniciar la sesión.'
                });
            }

            req.session.usuario = usuarioSesion;

            res.json({
                mensaje: 'Inicio de sesión correcto.',
                usuario: usuarioSesion
            });
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            mensaje: 'Error interno del servidor.'
        });
    }
});

// Consultar sesión
app.get('/api/me', (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({
            mensaje: 'No has iniciado sesión.'
        });
    }

    res.json({ usuario: req.session.usuario });
});

// Cerrar sesión
app.post('/api/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                mensaje: 'No se pudo cerrar la sesión.'
            });
        }

        res.clearCookie('chachichas.sid');
        res.json({ mensaje: 'Sesión cerrada correctamente.' });
    });
});

app.listen(PORT, () => {
    console.log(`API ejecutándose en http://localhost:${PORT}`);
});
