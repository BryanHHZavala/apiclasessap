// controllers/catedraticosController.js
const db = require('../config/db.js');

const mostrarCatedraticos = async (req, res) => {
    const query = 'SELECT id_catedratico, nombre_catedratico FROM catedraticos';

    try {
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener los catedráticos:", error);
        res.status(500).json({ error: 'Error al obtener los catedráticos' });
    }
};

module.exports = {
    mostrarCatedraticos
};
