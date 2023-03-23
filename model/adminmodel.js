
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdminSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    isVerifyed: {
        type: Boolean,
        default: true
    }
})
const AdminModel = new mongoose.model('admins', AdminSchema)
module.exports = AdminModel;