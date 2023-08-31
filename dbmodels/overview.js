import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const overviewSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    grammer: {
        type: Array
    },
    misspelling: {
        type: Array    
    },
    vocabsUsage: {
        type: Array
    },
    idiomsUsage: {
        type: Array
    }
}, {timestamps: true})

const Overviews = mongoose.model('overviews', overviewSchema)
// module.exports = Overviews;
export default Overviews