const mongoose = require('mongoose')


// Schema for DB
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    authLvl: {
        type: Number,
        required: false
    }
})

module.exports = mongoose.model('User', userSchema)