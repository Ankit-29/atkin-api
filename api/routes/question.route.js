const express = require('express');
const router = express.Router();

const QuestionController = require('../controllers/question.controller');

// MiddleWares 
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

router.post('/', checkAuth, checkAdmin, QuestionController.addQuestion);
router.get('/', QuestionController.getQuestions);
router.get('/:id', QuestionController.getQuestionById);
router.patch('/:id', checkAuth, checkAdmin, QuestionController.updateQuestion);
router.delete('/:id', checkAuth, checkAdmin, QuestionController.deleteCategory);



module.exports = router;