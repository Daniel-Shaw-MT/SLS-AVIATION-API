const mongoose = require('mongoose')


// Schema for DB
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
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
    authLvl: {
        type: Number,
        required: false
        
    },
    active: {
        type: Boolean
        
    }
})

module.exports = mongoose.model('User', userSchema)