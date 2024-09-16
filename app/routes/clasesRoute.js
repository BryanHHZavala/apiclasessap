const express = require('express');
const router = express.Router();

const { clases_carrera, buscarClases, eliminarSeccion } = require('../controllers/clasesController');

router.get('/carreras/:id_carrera/:id_periodo', clases_carrera);
router.get('/carreras/:id_carrera/:id_periodo/:id_clase', buscarClases);
router.delete('/carreras/:id_periodo', eliminarSeccion);

module.exports = router;