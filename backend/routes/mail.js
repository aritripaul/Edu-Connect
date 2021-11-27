const express = require('express')
const route = express.Router()
const { toSelfHtml, toSelfText } = require('../public/Templates/toSelf')
const {
    verificationHtml,
    verificationText,
} = require('../public/Templates/verification')
const {
    passwordResetHtml,
    passwordResetText,
} = require('../public/Templates/password_reset')
const { sendMail } = require('../modules/mailer')
const { SEARCH_USER_BY_USERNAME, SEARCH_USER_BY_UUID } = require('../db/user')
const { passwordResetRequestValidate } = require('../utils/validate_auth')
const db = require('../db/connect')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/auth')
const asyncWrapper = require('../utils/asyncWrapper')
const { messageValidate } = require('../utils/validate_user')
const target = 'http://localhost:3000/' //'https://dncjgec.in/'

route.post(
    '/to_self/',
    asyncWrapper(async (req, res) => {
        const { name, message, email } = req.body

        await messageValidate.validateAsync({
            name,
            message,
            email,
        })
        const to = 'aritripaul.paul@gmail.com'

        const html = toSelfHtml(to, name, message, email)
        const text = toSelfText(to, name, message, email)

        sendMail(to, `Website Message From ${name}`, text, html)
            .then((result) => {
                res.status(200).send(result.response)
            })
            .catch((err) => {
                res.status(500).send(err)
            })
    })
)
route.post(
    '/password_reset/',
    asyncWrapper(async (req, res) => {
        const { username } = req.body
        await passwordResetRequestValidate.validateAsync({
            username,
        })

        const dbResult = await db.query(SEARCH_USER_BY_USERNAME, [
            username,
            username,
        ])
        const { rows } = dbResult

        if (rows.length === 0) {
            res.status(400).send({
                message: 'No user exists with that username/email',
            })
            return
        }

        const { email, id, first_name } = rows[0]

        const token = jwt.sign({ id }, process.env.JWT_PASSWORD_RESET_TOKEN, {
            expiresIn: 1800,
        })

        const link = `${target}auth/recovery/${token}`
        const html = passwordResetHtml(first_name, link)
        const text = passwordResetText(first_name, link)
        sendMail(email, `Password Reset - Edu Connect`, text, html)
            .then((result) => {
                res.status(200).send(result.response)
            })
            .catch((err) => {
                res.status(500).send(err)
            })
    })
)

route.post(
    '/verify/',
    authMiddleware,
    asyncWrapper(async (req, res) => {
        const { first_name, email, last_name } = req.body
        const id = req.id

        const { rows } = await db.query(SEARCH_USER_BY_UUID, [id])

        if (rows.length === 0) {
            res.status(404).send({
                message: 'No user found',
            })
            return
        }

        const { verified } = rows[0]

        if (verified) {
            res.status(403).send({
                message: 'Already verified',
            })
            return
        }

        const token = jwt.sign({ id }, process.env.JWT_VERIFICATION_SECRET)
        const name = `${first_name} ${last_name}`
        const link = `${target}auth/verify/${token}`
        const html = verificationHtml(name, link)
        const text = verificationText(name, link)
        sendMail(email, `Verification - Edu Connect`, text, html)
            .then((result) => {
                res.status(200).send(result.response)
            })
            .catch((err) => {
                res.status(500).send(err)
            })
    })
)

module.exports = route
