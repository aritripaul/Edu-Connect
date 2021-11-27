const express = require('express')
const route = express.Router()
const asyncWrapper = require('../utils/asyncWrapper')
const { updateValidate } = require('../utils/validate_user')
const {
    SEARCH_STUDENT_BY_CLASS_USER_ID,
    SEARCH_CLASS_BY_UUID,
} = require('../db/classes')
const db = require('../db/connect')
const { response } = require('express')
const {
    GET_NOTIFICATION,
    POST_NOTIFICATION,
    GET_NOTIFICATION_BY_ID,
    DELETE_NOTIFICATION,
} = require('../db/notification')
const { notificationValidate } = require('../utils/validateNotification')
const { SEARCH_USER_BY_UUID } = require('../db/user')

route.get(
    '/:class_id',
    asyncWrapper(async (req, res) => {
        const user_id = req.id
        const role = req.role
        const { class_id } = req.params

        if (role === 'teacher') {
            const user = await db.query(SEARCH_USER_BY_UUID, [user_id])
            let { rows } = await db.query(SEARCH_CLASS_BY_UUID, [class_id])

            if (
                user.rows.length === 0 ||
                rows.length == 0 ||
                user.rows[0].username !== rows[0].created_by
            ) {
                res.status(403).send({
                    message: 'Access denied for user',
                })
                return
            }
        } else if (role === 'student') {
            let { rows } = await db.query(SEARCH_STUDENT_BY_CLASS_USER_ID, [
                class_id,
                user_id,
            ])

            if (rows.length === 0) {
                res.status(403).send({
                    message: 'Access denied for user',
                })
                return
            }
        }

        const result = await db.query(GET_NOTIFICATION, [class_id])
        res.status(200).send(result.rows)
    })
)

route.post(
    '/:class_id/',
    asyncWrapper(async (req, res) => {
        const user_id = req.id
        const role = req.role
        const { class_id } = req.params
        const { message } = req.body

        notificationValidate.validateAsync({
            message,
        })

        if (role === 'teacher') {
            const user = await db.query(SEARCH_USER_BY_UUID, [user_id])
            let { rows } = await db.query(SEARCH_CLASS_BY_UUID, [class_id])

            if (
                user.rows.length === 0 ||
                rows.length == 0 ||
                user.rows[0].username !== rows[0].created_by
            ) {
                res.status(403).send({
                    message: 'Access denied for user',
                })
                return
            }
        } else if (role === 'student') {
            let { rows } = await db.query(SEARCH_STUDENT_BY_CLASS_USER_ID, [
                class_id,
                user_id,
            ])

            if (rows.length === 0 || rows[0].verified === false) {
                res.status(403).send({
                    message: 'Access denied for user',
                })
                return
            }
        }

        const posting_user = await db.query(SEARCH_USER_BY_UUID, [user_id])
        const username = posting_user.rows[0].username
        const result = await db.query(POST_NOTIFICATION, [
            class_id,
            user_id,
            message,
            username,
        ])
        res.status(200).send(result.rows)
    })
)

route.delete(
    '/:notification_id/',
    asyncWrapper(async (req, res) => {
        const user_id = req.id
        const role = req.role
        const { notification_id } = req.params

        let { rows } = await db.query(GET_NOTIFICATION_BY_ID, [notification_id])

        if (rows.length === 0) {
            res.status(404).send({
                message: 'Not Found',
            })
            return
        }

        if (rows[0].user_id !== user_id) {
            res.status(403).send({
                message: 'Access denied for user',
            })
            return
        }

        await db.query(DELETE_NOTIFICATION, [notification_id])
        res.status(200).send({ message: 'Deleted Successfully' })
    })
)

module.exports = route
