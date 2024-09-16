const express = require('express');
const router = express.Router();
const {periodos, obtenerPeriodos} = require('../controllers/periodoController');

// Define la ruta que utiliza el controlador
router.post('/periodos', periodos);
router.get('/getPeriodos', obtenerPeriodos);

module.exports = router;