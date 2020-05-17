const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// Routes
const userRoutes = require('./api/routes/user.route');
const categoryRoutes = require('./api/routes/category.route');
const questionRoutes = require('./api/routes/question.route');


mongoose.connect('mongodb+srv://ankit:' +
    process.env.MONGO_ATLAS_PASS +
    '@node-rest-shop-rdiby.mongodb.net/atkin?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        return res.status(200).json({});
    }
    next();
});


app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/question', questionRoutes);



app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});

module.exports = app;