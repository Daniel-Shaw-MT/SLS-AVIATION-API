require('dotenv').config()

const express = require('express')
const router = express.Router()

const Flight = require('../models/flight')
const User = require('../models/user')
const Location = require('../models/location')

const jwt = require('jsonwebtoken')

// Login
router.post('/login', getUsr, async (req, res) => {
    if (req.body.password == res.user.password) {
        const usr = res.user
        jwt.sign({ usr }, process.env.SECRET_TOKEN, (err, token) => {
            res.json({
                token: token
            })
        })
    } if (req.body.password != res.user.password) {
        res.status(404).json({ message: 'Incorrect Password!' })
    }

})
// Sign Up
router.post('/signup', async (req, res) => {
    const user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        authLvl: 0,
    })
    const internalU = await User.findOne({ userName: req.body.userName }).exec()
    if (internalU != null) {
        res.status(400).json({ message: 'Username already exists!' })
    } else {
        try {
            const newUser = await user.save()
            res.status(201).json(`Created User ` + req.body.userName)
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    }

})

// Getting all flights
router.get('/', verifyToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_TOKEN, async(err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
                try {
                    const flight = await Flight.find()
                    res.json(flight)
                    console.log(authData)

                } catch (err) {
                    res.status(500).json({ message: err.message })
                }
            

        }
    })


})

// Getting a specific flight based by ID
router.get('/:id', verifyToken, getFlight, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_TOKEN, (err, authData) => {
        if (err) {
            res.json({ message: err })
        } else {
            res.send(res.flight)
        }

    })
})
// Creating a flight
router.post('/', verifyToken, (req, res) => {
    const flight = new Flight({
        name: req.body.name,
        desc: req.body.desc,
        stops: req.body.stops,
        depLoc: req.body.depLoc,
        arrLoc: req.body.arrLoc,
        depTime: req.body.depTime,
        edt: req.body.edt,
        eta: req.body.eta
    })
    jwt.verify(req.token, process.env.SECRET_TOKEN, async (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            console.log(authData.usr)
            if (authData.usr.authLvl >= 3) {
                try {
                    const newFlight = await flight.save()
                    res.status(201).json({ message: 'Saved flight!' })

                } catch (err) {
                    res.status(400).json({ message: err.message })
                }
            } else {
                res.status(403).json({ message: 'You dont have access to this feature!' })
            }
        }

    })
})
// Update a flight
router.patch('/:id', getFlight, verifyToken, async (req, res) => {
    if (req.body.name != null) {
        res.flight.name = req.body.name
    }
    if (req.body.desc != null) {
        res.flight.desc = req.body.desc
    }
    if (req.body.stops != null) {
        res.flight.stops = req.body.stops
    }
    if (req.body.depLoc != null) {
        res.flight.depLoc = req.body.depLoc
    }
    if (req.body.arrLoc != null) {
        res.flight.arrLoc = req.body.arrLoc
    }
    if (req.body.depTime != null) {
        res.flight.depTime = req.body.depTime
    }
    if (req.body.edt != null) {
        res.flight.edt = req.body.edt
    }
    if (req.body.eta != null) {
        res.flight.eta = req.body.eta
    }
    jwt.verify(req.token, process.env.SECRET_TOKEN, async (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            if (authData.usr.authLvl >= 3) {
                try {
                    const updatedFlight = await res.flight.save()
                    res.json(updatedFlight)
                } catch (err) {
                    res.status(400).json({ message: err.message })
                }
            } else {
                res.status(403).json({ message: 'You dont have access to this feature!' })
            }
        }
    })
})

// Deleting a flight
router.delete('/:id', getFlight, verifyToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_TOKEN, async (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            if (authData.usr.authLvl >= 3) {
                try {
                    await res.flight.remove()
                    res.json({ message: "Deleted Flight!" })
                } catch (err) {
                    res.status(500).json({ messgae: err.message })
                }
            } else {
                res.status(403).json({ message: 'You dont have access to this feature!' })
            }
        }
    })
})

// Used to retrieve specified flight then passes information to caller.
async function getFlight(req, res, next) {
    let flight
    try {
        flight = await Flight.findById(req.params.id)
        if (flight == null) {
            return res.status(500).json({ message: err.message })

        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.flight = flight
    next()
}

// Used to retrieve specified user and then passes info to caller.
async function getUsr(req, res, next) {
    let user
    try {
        user = await User.findOne({ userName: req.body.userName }).exec()
        if (user == null) {
            return res.status(404).json({ message: 'User not found' })

        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.user = user
    next()
}

// Formating
// Authorization: Bearer <TOKEN>

// Protect endpoint
function verifyToken(req, res, next) {
    // Retrieve header value (auth value)
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        // Split at space
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        // Set token
        req.token = bearerToken
        next()

    } else {
        // Forbidden
        res.sendStatus(403)
    }
}

module.exports = router