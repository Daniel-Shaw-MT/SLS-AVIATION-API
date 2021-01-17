const mongoose = require('mongoose')

const flightSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Flight', flightSchema)