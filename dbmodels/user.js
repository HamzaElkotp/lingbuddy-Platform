import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    students: {
        type: Array
    }
}, {timestamps: true})

const Users = mongoose.model('users', userSchema)
// module.exports = Users;
export default Users