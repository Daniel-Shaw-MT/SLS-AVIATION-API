const mongoose = require('mongoose')


// Schema for DB
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: email,
        required: true
    },
    password: {
        type: password,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)