const db = require('../config/db.js');

const clases_carrera = async (req, res) => {
    const { id_carrera, id_periodo } = req.params;

    const query = `
      SELECT
          b.id_bloque, 
          b.nombre_bloque AS bloque,
          JSON_ARRAYAGG(
              JSON_OBJECT(
                  'id_clase', c.id_clase,
                  'nombre_clase', c.nombre_clase,
                  'creditos', c.creditos,
                  'secciones', (
                      SELECT 
                          JSON_ARRAYAGG(
                              JSON_OBJECT(
                                  'id_detalle', dp.id_detalle,
                                  'seccion', dp.seccion,
                                  'catedratico', ct.nombre_catedratico,
                                  'hora_inicio', dp.hora_inicio
                              )
                          )
                      FROM 
                          detalle_periodo dp
                          LEFT JOIN catedraticos ct ON dp.id_catedratico = ct.id_catedratico
                      WHERE 
                          dp.id_ccb = ccb.id_ccb
                          AND dp.id_periodo = ?
                  )
              )
          ) AS clases
      FROM 
          bloques b
          LEFT JOIN 
              carrera_clase_bloque ccb ON b.id_bloque = ccb.id_bloque
          LEFT JOIN 
              clases c ON ccb.id_clase = c.id_clase
      WHERE 
          ccb.id_carrera = ?
      GROUP BY 
          b.id_bloque, 
          b.nombre_bloque;
    `;

    try {
      const [rows] = await db.query(query, [id_periodo, id_carrera]);

      // Los datos ya están en formato JSON, por lo que no es necesario parsear
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener las clases');
    }
};

const buscarClases = async (req, res) => {
    const { id_carrera, id_periodo } = req.params;
    const { id_clase, nombre_clase } = req.query; // Obtener parámetros de búsqueda desde la query string

    // Construir la consulta SQL con condiciones dinámicas
    let query = `
      SELECT
          b.id_bloque, 
          b.nombre_bloque AS bloque,
          JSON_ARRAYAGG(
              JSON_OBJECT(
                  'id_clase', c.id_clase,
                  'nombre_clase', c.nombre_clase,
                  'creditos', c.creditos,
                  'secciones', (
                      SELECT 
                          JSON_ARRAYAGG(
                              JSON_OBJECT(
                                  'id_detalle', dp.id_detalle,
                                  'seccion', dp.seccion,
                                  'catedratico', ct.nombre_catedratico,
                                  'hora_inicio', dp.hora_inicio
                              )
                          )
                      FROM 
                          detalle_periodo dp
                          LEFT JOIN catedraticos ct ON dp.id_catedratico = ct.id_catedratico
                      WHERE 
                          dp.id_ccb = ccb.id_ccb
                          AND dp.id_periodo = ?
                  )
              )
          ) AS clases
      FROM 
          bloques b
          LEFT JOIN 
              carrera_clase_bloque ccb ON b.id_bloque = ccb.id_bloque
          LEFT JOIN 
              clases c ON ccb.id_clase = c.id_clase
      WHERE 
          ccb.id_carrera = ?
    `;

    const queryParams = [id_periodo, id_carrera];

    // Añadir condiciones para búsqueda por id_clase o nombre_clase si están presentes
    if (id_clase) {
        query += ` AND c.id_clase = ?`;
        queryParams.push(id_clase);
    }

    if (nombre_clase) {
        query += ` AND c.nombre_clase LIKE ?`;
        queryParams.push(`%${nombre_clase}%`);
    }

    query += ` GROUP BY b.id_bloque, b.nombre_bloque;`;

    try {
        const [rows] = await db.query(query, queryParams);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener las clases');
    }
};

const eliminarSeccion = async (req, res) => {
    const { id_seccion, id_clase } = req.body;
    const { id_periodo } = req.params; 

    try {
        // Eliminar las secciones correspondientes en todas las relaciones id_ccb asociadas con el id_clase
        await db.query(
            `DELETE dp
             FROM detalle_periodo dp
             INNER JOIN carrera_clase_bloque ccb
             ON dp.id_ccb = ccb.id_ccb
             WHERE dp.id_periodo = ? 
               AND dp.seccion = ? 
               AND ccb.id_clase = ?`,
            [id_periodo, id_seccion, id_clase]
        );

        res.send('Sección eliminada correctamente en todas las carreras.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar la sección.');
    }
};

module.exports = { clases_carrera, buscarClases, eliminarSeccion };
