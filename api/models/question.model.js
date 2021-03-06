const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    qId: { type: Number, unique: true, required: true },
    title: { type: String, required: true },
    question: { type: String, required: true },
    categories: {
        type: [{ type: String }],
        validate: v => v == null || v.length > 0
    },
    testCases: {
        type: [{
            testCase: { type: String, required: true },
            answer: { type: String, required: true },
        }],
        validate: v => v == null || v.length > 0
    },
    level: { type: Number, default: 1 }, // 1-> Easy, 2 -> Medium , 3 -> Hard
    type: { type: Number, default: 1 }, // 1 -> Practice, 2 -> Hidden For Tests
    active: { type: Boolean, default: true }
});


module.exports = mongoose.model('Question', questionSchema); 