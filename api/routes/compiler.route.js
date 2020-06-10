const express = require('express');
const router = express.Router();

const CompilerController = require('../controllers/compiler.controller');

router.post('/compile', CompilerController.compile);
router.get('/languages', CompilerController.languages);
router.post('/submit', CompilerController.submitQuestion);
router.post('/result', CompilerController.batchResult);

module.exports = router;