import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const resourceTaskSchema = new Schema({
    temail: {
        type: String,
        required: true
    },
    taskname: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    answered: {
        type: String,
    }
}, {timestamps: true})

const Resourcetasks = mongoose.model('Resourcetasks', resourceTaskSchema)
// module.exports = Resourcetasks;
export default Resourcetasks