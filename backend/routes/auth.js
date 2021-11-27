const express = require('express')
const route = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {
    loginValidate,
    signupValidate,
    passwordResetValidate,
} = require('../utils/validate_auth')
const asyncWrapper = require('../utils/asyncWrapper')
const {
    SEARCH_USER_BY_USERNAME,
    INSERT_USER,
    UPDATE_USER_VERIFICATION,
    SEARCH_USER_BY_UUID,
    UPDATE_USER_PASSWORD,
    generateAuthTokens,
    generateAccessToken,
} = require('../db/user')
const db = require('../db/connect')

route.post(
    '/login/',
    asyncWrapper(async (req, res) => {
        const { username, password } = req.body

        await loginValidate.validateAsync({
            username,
            password,
        })
        const dbResult = await db.query(SEARCH_USER_BY_USERNAME, [
            username,
            username,
        ])
        const { rows } = dbResult

        if (rows.length === 0) {
            res.status(400).send({
                message: 'No user exists with that username/email and password',
            })
            return
        }

        const result = await bcrypt.compare(password, rows[0].password)

        if (!result) {
            res.status(400).send({
                message: 'No user exists with that username/email and password',
            })
            return
        }

        const user = rows[0]
        const { accessToken, refreshToken } = generateAuthTokens(
            user.id,
            user.role
        )

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
        })

        res.status(200).send({
            id: user.id,
            accessToken,
            refreshToken,
        })
    })
)

route.post(
    '/signup/',
    asyncWrapper(async (req, res) => {
        const {
            employee_id,
            username,
            password,
            organization,
            email,
            first_name,
            last_name,
            confirm_password,
            role,
        } = req.body

        await signupValidate.validateAsync({
            ...req.body,
        })

        const hash_password = await bcrypt.hash(password, 10)

        let { rows } = await db.query(SEARCH_USER_BY_USERNAME, [
            username,
            email,
        ])

        if (rows.length) {
            res.status(400).send({
                message: 'User with this email/username already exists',
            })
            return
        }

        const dbResult = await db.query(INSERT_USER, [
            employee_id,
            first_name,
            last_name,
            email,
            organization,
            username,
            hash_password,
            role,
        ])
        rows = dbResult.rows
        const id = rows[0].id

        const { accessToken, refreshToken } = generateAuthTokens(id, role)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
        })

        res.status(200).send({
            id,
            accessToken,
            refreshToken,
        })
        return
    })
)

route.get(
    '/refresh_token/',
    asyncWrapper(async (req, res) => {
        const token = req.cookies.refreshToken
        if (!token) {
            res.status(401).send({
                message: 'No refresh token found in cookies',
            })
            return
        }
        jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET,
            function (error, decoded) {
                if (error) {
                    res.status(401).send({
                        ...error,
                    })
                    return
                }
                const id = decoded.id
                const role = decoded.role
                const accessToken = generateAccessToken(id, role)
                res.status(200).send({
                    accessToken,
                    expiresIn: 10000,
                })
            }
        )
    })
)

route.put(
    '/verify/',
    asyncWrapper(async (req, res) => {
        const { token } = req.body
        if (!token) {
            res.status(400).send({
                message: 'Verification token required',
            })
            return
        }

        const result = await jwt.verify(
            token,
            process.env.JWT_VERIFICATION_SECRET
        )

        const { id } = result

        if (!id) {
            res.status(403).send({
                message: 'Wrong id verification requested',
            })
            return
        }

        const { rows } = await db.query(SEARCH_USER_BY_UUID, [id])

        if (rows.length === 0) {
            res.status(404).send({
                message: 'No user found',
            })
            return
        }

        const { verified } = rows[0]

        if (verified) {
            res.status(200).send({
                message: 'Already verified',
            })
            return
        }

        await db.query(UPDATE_USER_VERIFICATION, ['true', id])

        res.status(200).send({
            message: 'Successfully verified',
        })
    })
)

route.put(
    '/password_reset/',
    asyncWrapper(async (req, res) => {
        const { token, password, confirm_password } = req.body
        await passwordResetValidate.validateAsync({
            password,
            confirm_password,
        })
        if (!token) {
            res.status(400).send({
                message: 'Password reset token required',
            })
            return
        }

        const result = await jwt.verify(
            token,
            process.env.JWT_PASSWORD_RESET_TOKEN
        )

        const { id } = result

        if (!id) {
            res.status(403).send({
                message: 'Password Reset Not Allowed',
            })
            return
        }

        const { rows } = await db.query(SEARCH_USER_BY_UUID, [id])

        if (rows.length === 0) {
            res.status(404).send({
                message: 'No user found',
            })
            return
        }

        const hash_password = await bcrypt.hash(password, 10)

        await db.query(UPDATE_USER_PASSWORD, [hash_password, id])

        res.status(200).send({
            message: 'Password has been successfully reset',
        })
    })
)

module.exports = route
