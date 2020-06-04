const mongoose = require('mongoose');
const axios = require('axios');
const judge0ApiEndpoint = 'http://localhost:85';


exports.compile = (req, res, next) => {
    console.log("asd");
    const submission = {
        source_code: req.body.sourceCode,
        language_id: req.body.languageId,
        stdin: req.body.stdin || null,
    }
    console.log(submission);
    axios({
        method: 'post',
        url: `${judge0ApiEndpoint}/submissions/?base64_encoded=false&wait=true`, 
        data : submission,   
    }).then(response => {
        return res.status(200).send(response.data);
    }).catch(error => {
        return res.status(500).send(error);
    });
}   