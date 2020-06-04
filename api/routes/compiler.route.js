const express = require('express');
const router = express.Router();

const CompilerController = require('../controllers/compiler.controller');

router.post('/compile', CompilerController.compile);

// router.post('/login', UserController.login);

module.exports = router;