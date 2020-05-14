const mongoose = require('mongoose');
const Category = require('../models/category.model');

exports.createCategory = (req, res, next) => {
    Category.find({ name: req.body.name })
        .exec()
        .then(category => {
            console.log(category);
            if (category.length >= 1) {
                return res.status(409).json({
                    message: "Category Already Exist"
                });
            } else {
                const category = new Category({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    description: req.body.description
                });

                category.save()
                    .then(result => {
                        res.status(200).json({
                            message: 'Category Created'
                        })
                    })
            }
        }).catch(err => {
            return res.status(500).json({
                error: err
            })
        })
}


exports.getCategories = (req, res, next) => {
    Category.find()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        ...doc._doc,
                        request: {
                            type: 'GET',
                            url: `/category/${doc._id}`
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


exports.updateCategory = (req, res, next) => {
    const id = req.params.id;
    Category.updateOne({ _id: id }, { $set: req.body })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Category Updated",
                request: {
                    type: 'GET',
                    url: `/category/${id}`
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}


exports.deleteCategory = (req, res, next) => {
    const id = req.params.id;
    Category.deleteOne({ _id: id })
        .exec()
        .then(result => {
            if (result.deletedCount) {
                res.status(200).json({
                    message: "Category Deleted"
                });
            } else {
                res.status(404).json({
                    error: {
                        message: "Category Not Found"
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}