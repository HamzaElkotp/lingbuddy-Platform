import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const writingMockSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    questions: {
        type: Array,
        required: true
    },
    answers: {
        type: Array,
        required: true
    },
    aifeedbacks: {
        type: Array,
        required: true
    },
    teacherfeedback: {
        type: Array
    },
    score: {
        type: String,
        required: true
    },
}, {timestamps: true})

const WritingMock = mongoose.model('writingMock', writingMockSchema)
// module.exports = WritingMock;
export default WritingMock