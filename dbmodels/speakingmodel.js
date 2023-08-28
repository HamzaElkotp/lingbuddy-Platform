const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const speakSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    questions: {
        type: Array,
        required: true
    },
    answersBase64: {
        type: Array,
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

const Speakings = mongoose.model('speakings', speakSchema)
module.exports = Speakings;