const db = require('../config/db');

const periodos = (req, res) => {
    const datos = req.body;
    let periodo = datos.periodo; // 'Periodo I', 'Periodo II', etc.
    let fecha_ini = datos.fecha_inicio; // Debe ser en formato YYYY-MM-DD
    let fecha_fin = datos.fecha_final; // Debe ser en formato YYYY-MM-DD
    let anio = datos.anio; // Año en formato YYYY

    // Convertir periodo en el formato deseado
    let id_periodo;
    if (periodo === 'Periodo I') {
        id_periodo = `${anio}I`;
    } else if (periodo === 'Periodo II') {
        id_periodo = `${anio}II`;
    } else if (periodo === 'Periodo III') {
        id_periodo = `${anio}III`;
    } else {
        res.status(400).send('Período no válido');
        return;
    }

    // Verificar el formato de las fechas
    const fechaPattern = /^\d{4}-\d{2}-\d{2}$/; // Formato YYYY-MM-DD
    if (!fechaPattern.test(fecha_ini) || !fechaPattern.test(fecha_fin)) {
        res.status(400).send('Fechas en formato incorrecto');
        return;
    }

    let insert_periodo = 'INSERT INTO periodos (id_periodo, fecha_inicio, fecha_final) VALUES (?, ?, ?)';

    db.query(insert_periodo, [id_periodo, fecha_ini, fecha_fin], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error en la consulta');
            return;
        }
        console.log('Periodo registrado con éxito');
        res.json({ message: 'Periodo registrado con éxito', results });
    });
};
// Asegúrate de que db esté configurado para usar promesas

// Función para obtener los periodos
const obtenerPeriodos = async (req, res) => {
    try {
        const [results] = await db.query('SELECT id_periodo FROM periodos ORDER BY id_periodo DESC');
        res.json(results);
    } catch (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).send('Error en la consulta');
    }
};

module.exports = { obtenerPeriodos };


module.exports = { periodos, obtenerPeriodos};