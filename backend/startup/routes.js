const helmet = require('helmet')
const express = require('express')
const compiler = require('../routes/compiler')
const mailer = require('../routes/mail')
const cors = require('cors')
const errors = require('../middleware/errors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const auth = require('../routes/auth')
const user = require('../routes/user')
const authMiddleware = require('../middleware/auth')
const classes = require('../routes/classes')
const verification = require('../routes/verification')
const assignments = require('../routes/assignments')
const schedule = require('../routes/schedule')
const attendance = require('../routes/attendance')
const notification = require('../routes/notification')

let whitelist = ['https://website/', 'http://localhost:3000']
let corsOptions = {
    origin: true,
    credentials: true,
}

module.exports = function (app) {
    app.use(helmet())
    app.use(cors(corsOptions))
    app.use(cookieParser())
    app.use(morgan('tiny'))
    app.use(express.urlencoded({ extended: true }))
    app.use('/public', express.static('public'))
    app.use(express.json({ limit: '5mb' }))
    app.use('/mailer', mailer)
    app.use('/compile', compiler)
    app.use('/auth', auth)

    app.use(authMiddleware)
    app.use('/user', user)
    app.use('/classes', classes)
    app.use('/verification', verification)
    app.use('/assignments', assignments)
    app.use('/schedule', schedule)
    app.use('/attendance', attendance)
    app.use('/notification', notification)
    app.use(errors)
}
