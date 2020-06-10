const mongoose = require('mongoose');
const axios = require('axios');
const Question = require('../models/question.model');

const judge0ApiEndpoint = 'http://localhost:85';

exports.compile = (req, res, next) => {
    const submission = {
        source_code: req.body.sourceCode,
        language_id: req.body.languageId,
        stdin: req.body.stdin || null,
    }
    console.log(submission);
    axios({
        method: 'post',
        url: `${judge0ApiEndpoint}/submissions/?base64_encoded=false&wait=true`,
        data: submission,
    }).then(response => {
        return res.status(200).send(response.data);
    }).catch(error => {
        return res.status(500).send(error);
    });
}


exports.languages = (req, res, next) => {
    axios({
        method: 'get',
        url: `${judge0ApiEndpoint}/languages`,
    }).then(response => {
        return res.status(200).send(response.data);
    }).catch(error => {
        return res.status(500).send(error);
    });
}

exports.submitQuestion = (req, res, next) => {
    Question.find({ qId: req.body.qId })
        .exec()
        .then(question => {
            console.log(question);
            if (question.length >= 1) {
                const questionData = { ...question[0]._doc }
                const submission = createBatchSubmission(req.body.sourceCode, req.body.languageId, questionData.testCases);
                submitBatch(submission).then(response => {
                    res.status(200).send(response.data);
                }).catch(err => {
                    res.status(500).json({
                        message: err.message
                    });
                });

            } else {
                res.status(404).json({
                    message: "Question Not Found"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
        });

}


exports.batchResult = (req, res, next) => {
    const reqUrl = getBatchResultUrl(req.body);
    axios({
        method: 'get',
        url: reqUrl,
    }).then(response => {
        return res.status(200).send(response.data);
    }).catch(error => {
        return res.status(500).send(error);
    });
}



// Helpers

createBatchSubmission = (sourceCode, languageId, testCases) => {
    let submissions = [];
    testCases.forEach(testCase => {
        submissions.push({
            source_code: sourceCode,
            language_id: languageId,
            stdin: testCase.testCase || null,
            expected_output: testCase.answer,
        });
    });

    return submissions;
}

submitBatch = (submission) => {
    return axios({
        method: 'post',
        url: `${judge0ApiEndpoint}/submissions/batch?base64_encoded=false`,
        data: { submissions: submission },
    }).then(response => {
        return response
    })
}

getBatchResultUrl = (tokensData) => {
    let tokenArray = [];
    tokensData.forEach(token => {
        tokenArray.push(token.token);
    });
    return `${judge0ApiEndpoint}/submissions/batch?tokens=${tokenArray.join(',')}`;
}