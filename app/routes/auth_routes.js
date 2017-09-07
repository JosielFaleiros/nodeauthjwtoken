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

module.exports = router
