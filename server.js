const mongoose = require('mongoose')
const morgan = require('morgan')
const express = require('express')

const config = require('./pub_config/config')

const app = express()
const port = 8080
/*
Connecting to MongoDB
*/
mongoose.connect(config.db.url,  { useMongoClient: true })
var db = mongoose.connection

db.once('open', () => {
    console.log('\nconnected to database')
})

/*
Simple app that will log all request in the 
Apache combined format to STDOUT
*/
app.use(morgan('combined'))

const AuthRouter = require('./app/routes/auth_routes')
app.use('/', AuthRouter)

app.listen(port, () => {
    console.log('Running on ' + port)
})
