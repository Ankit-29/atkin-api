const express = require('express');
const router = express.Router();

const CategoryController = require('../controllers/category.controller');

// MiddleWares 
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');


router.post('/', checkAuth, checkAdmin, CategoryController.createCategory);
router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategoryById);
router.patch('/:id', checkAuth, checkAdmin, CategoryController.updateCategory);
router.delete('/:id', checkAuth, checkAdmin, CategoryController.deleteCategory);


module.exports = router;