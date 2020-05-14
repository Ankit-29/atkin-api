const mongoose = require('mongoose');

const Question = require('../models/question.model');

exports.addQuestion = (req, res, next) => {
    let qId = 1;
    Question.find()
        .sort({ $natural: -1 })
        .limit(1)
        .exec()
        .then(result => {
            if (result.length >= 1) {
                qId = result[0].qId + 1;
                console.log(qId);
            }
            console.log(qId);

            const question = new Question({
                ...req.body,
                _id: new mongoose.Types.ObjectId(),
                qId: qId
            });
            question.save()
                .then(result => {
                    res.status(201).json({
                        message: 'Question Created'
                    })
                }).catch(err => {
                    return res.status(500).json({
                        error: err
                    })
                });

        }).catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            })
        });
}



exports.getQuestions = (req, res, next) => {
    Question.find()
        .then(docs => {
            const response = {
                count: docs.length,
                questions: docs.map(doc => {
                    return {
                        ...doc._doc,
                        request: {
                            type: 'GET',
                            url: `/question/${doc.qId}`
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.getQuestionById = (req, res, next) => {
    const id = req.params.id;
    Question.find({ qId: id })
        .exec()
        .then(question => {
            if (question.length >= 1) {
                res.status(200).json({
                    ...question[0]._doc,
                });
            } else {
                res.status(404).json({
                    error: {
                        message: "Question Not Found"
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.updateQuestion = (req, res, next) => {
    const id = req.params.id;
    Question.updateOne({ qId: id }, { $set: req.body })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Question Updated",
                request: {
                    type: 'GET',
                    url: `/question/${id}`
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

exports.deleteCategory = (req, res, next) => {
    const id = req.params.id;
    Question.deleteOne({ qId: id })
        .exec()
        .then(result => {
            if (result.deletedCount) {
                res.status(200).json({
                    message: "Question Deleted"
                });
            } else {
                res.status(404).json({
                    error: {
                        message: "Question Not Found"
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}