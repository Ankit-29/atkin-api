const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

exports.signUp = (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const type = req.body.type || 2;

    User.find({ email: email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Email already Exist"
                });
            } else {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {

                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name: name,
                            email: email,
                            password: hash,
                            type: type
                        });

                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User Created'
                                })
                            })
                            .catch(err => {
                                return res.status(500).json({
                                    error: err
                                })
                            });
                    }
                });
            }
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        });
}

exports.login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    });
                }

                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id,
                        name: user[0].name,
                        type: user[0].type,
                    }, process.env.JWT_KEY, {
                        expiresIn: "365d"
                    });

                    return res.status(200).json({
                        message: 'Auth Successful',
                        data: {
                            email: user[0].email,
                            userId: user[0]._id,
                            name: user[0].name,
                            type: user[0].type
                        },
                        token: token
                    });
                }

                return res.status(401).json({
                    message: 'Auth Failed'
                });
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        });
}


exports.solvedQuestions = (req, res, next) => {
    User.find({ email: req.userData.email })
        .then(user => {
            if (user.length == 1) {
                res.status(200).json({
                    solvedQuestions: user[0].solvedQuestions 
                });
            } else {
                res.status(404).json({
                    message: "Solved Question Not Found"
                });
            }
        })
        .catch(err => {
            res.status(500).json({ err });
        });
}


exports.updateSolvedQuestion = (req, res, next) => {
    User.updateOne({ email: req.userData.email }, { $set: req.body })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Question Solved",
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}