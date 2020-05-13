const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String }
});

module.exports = mongoose.model('Category',categorySchema);