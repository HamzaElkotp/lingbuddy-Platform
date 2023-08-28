const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const writingSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    question: {
        type: String
    },
    answer: {
        type: String,
        required: true
    },
    aifeedback: {
        type: String,
        required: true
    },
    teacherfeedback: {
        type: String
    },
    score: {
        type: String,
        required: true
    },
}, {timestamps: true})

const Writings = mongoose.model('writings', writingSchema)
module.exports = Writings;