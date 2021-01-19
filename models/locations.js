const mongoose = require('mongoose')

// Schema for DB
const locSchema = new mongoose.Schema({
    locName: {
        type: String,
        required: true
    },
    airportTag: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lon: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Location', locSchema)