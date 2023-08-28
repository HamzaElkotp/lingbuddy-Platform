const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const speakingMockSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    part1Questions: {
        type: Array,
        required: true
    },
    part1Answers: {
        type: Array,
        required: true
    },
    part1aifeedbacks: {
        type: String,
        required: true
    },
    part1teacherfeedback: {
        type: String
    },
    part2Questions: {
        type: Array,
        required: true
    },
    part2Answers: {
        type: Array,
        required: true
    },
    part2aifeedbacks: {
        type: String,
        required: true
    },
    part2teacherfeedback: {
        type: String
    },
    part3Questions: {
        type: Array,
        required: true
    },
    part3Answers: {
        type: Array,
        required: true
    },
    part3aifeedbacks: {
        type: String,
        required: true
    },
    part3teacherfeedback: {
        type: String
    },
    score: {
        type: String,
        required: true
    },
}, {timestamps: true})

const SpeakingMock = mongoose.model('speakingMock', speakingMockSchema)
module.exports = SpeakingMock;