import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const meetSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    teacherEmail: {
        type: String,
        required: true
    },
    studentEmail: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
    }
}, {timestamps: true})

const Meetings = mongoose.model('meetings', meetSchema)
// module.exports = Meetings;
export default Meetings