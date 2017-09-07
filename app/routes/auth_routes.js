const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const config = require('../../pub_config/config')
const jwt = require('jsonwebtoken')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
/* TODO check why! OR */
/*
router.use(bodyParser.urlencoded({ extended: true }))
*/
router.get('/profile', (req, res) => {
    let token = req.headers['x-access-token']
    if (!token) return res.status(401)
        .send({ auth: false, 
        message: 'No token provided.' })
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return res.status(500)
            .send({ auth: false, 
            message: 'Failed to authenticate token.' })
        User.findById(decoded.id,
            { password: 0 }, (err, user) => {
            if (err) return res.status(500).send('There was a problem.')
            if (!user) return res.status(404).send('No user found.')
            res.status(200).send(user)
        })
    })
})
router.post('/register', (req, res) => {
    let hashedPassword = bcrypt.hashSync(req.body.password, 12)
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    },
    (err, user) => {
        if (err) return res.status(500)
                .send('There occured a problem :/')
        console.log(user)
        /* expiresIn 1 hour */
        let token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 3600
        })
        res.status(200).send({ auth: true, token: token })
    })
})
router.post('/login', (req, res) => {
    console.log(req.body)
    if (!req.body.email || !req.body.password ) return res.status(402)
        .send({ message: 'The email and password must be set.' })
    User.findOne(
        { email: req.body.email }, (err, user) => {
        console.log(user)
        if (err)  return res.status(500).send('Error on the server.')
        if (!user) return res.status(404).send('No user found.')
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
        if (!passwordIsValid) return res.status(401)
            .send({ auth: false, token: null })
        let token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 3600
        })
        res.status(200).send({ auth: true, token: token })
    })
})

router.get('/logout', (req, res) => {
    res.send({ auth: false, token: null })
})
module.exports = router
