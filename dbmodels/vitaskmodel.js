const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vitaskSchema = new Schema({
    temail: {
        type: String,
        required: true
    },
    number: {
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

const Vitask = mongoose.model('Vitasks', vitaskSchema)
module.exports = Vitask;