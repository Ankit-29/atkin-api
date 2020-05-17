const express = require('express');
const router = express.Router();

const QuestionController = require('../controllers/question.controller');

// MiddleWares 
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

router.post('/', checkAuth, checkAdmin, QuestionController.addQuestion);
router.get('/', QuestionController.getQuestions);
router.get('/filter', QuestionController.getQuestionByFilter);
router.get('/:id', QuestionController.getQuestionById);
router.put('/:id', checkAuth, checkAdmin, QuestionController.updateQuestion);
router.delete('/:id', checkAuth, checkAdmin, QuestionController.deleteQuestion);


module.exports = router;