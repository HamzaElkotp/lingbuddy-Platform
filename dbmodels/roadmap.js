import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const roadmapSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    improve: {
        type: String,
        required: true
    },
    studyHours: {
        type: String,
        required: true
    },
    roadmap: {
        type: String,
        required: true
    },
    teacherNote: {
        type: String
    }
}, {timestamps: true})

const Roadmaps = mongoose.model('roadmaps', roadmapSchema)
// module.exports = Roadmaps;
export default Roadmaps