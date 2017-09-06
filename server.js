const morgan = require('morgan')
const express = require('express')

const app = express()
const port = 8080

/*
Simple app that will log all request in the 
Apache combined format to STDOUT
*/
app.use(morgan('combined'))

app.listen(port, () => {
    console.log('Running on ' + port)
})
