const express = require('express')
const router = express.Router()
const Flight = require('../models/flight')
const jwt = require('jsonwebtoken')

// Getting all flights
router.get('/', async (req, res)=>{
    try{
        const flight = await Flight.find()
        res.json(flight)
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

// Getting a specific flight based by ID
router.get('/:id', getFlight, (req, res)=>{
    res.send(res.flight)
})

// Creating a flight
router.post('/', async (req, res)=>{
    const flight = new Flight({
        name: req.body.name,
        desc: req.body.desc,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    })
    try{
        const newFlight = await flight.save()
        res.status(201).json(newFlight)
    }catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.post('/login', (req, res)=>{
    // User
    const user = 
    jwt.sign()
})

// Update a flight
router.patch('/:id', getFlight, async(req, res)=>{
    if(req.body.name != null){
        res.flight.name = req.body.name
    }if(req.body.desc != null){
        res.flight.desc = req.body.desc
    }if(req.flight.latitude != null){
        res.flight.latitude = req.body.latitude
    }if(req.flight.longitude != null){
        res.flight.longitude = req.body.longitude
    }try{
        const updatedFlight = await res.flight.save()
        res.json(updatedFlight)
    }catch(err){
        res.status(400).json({ message: err.message })
    }
})

// Deleting a flight
router.delete('/:id', getFlight, async (req, res)=>{
    try{
        await res.flight.remove()
        res.json({ message: "Deleted Flight!"})
    }catch(err){
        res.status(500).json({ messgae: err.message })
    }
})

// Used to retrieve specified flight then passes information to caller.
async function getFlight(req, res, next) {
    let flight
    try{
        flight = await Flight.findById(req.params.id)
        if(flight == null) {
            return res.status(500).json({ message: err.message})
        
        }
    }catch(err){
        return res.status(500).json({ message: err.message })
    }
    res.flight = flight
    next()
}

module.exports = router