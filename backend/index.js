const express = require('express')
const dotenv = require('dotenv').config()
const app = express()

require('./startup/config.js')()
require('./startup/db')()
require('./startup/routes.js')(app)

const port = process.env.PORT || 3001
const server = app.listen(port, () => {
    console.log('Edu Connect Apis Running On Port ' + port)
})

module.exports = server
