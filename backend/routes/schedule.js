const express = require('express')
const route = express.Router()
const { ValidateScheduleClass } = require('../utils/validate_class')
const { SEARCH_CLASS_BY_UUID, SEARCH_CLASS_CREATOR } = require('../db/classes')
const {
    INSERT_INTO_SCHEDULED_CLASSES,
    SEARCH_SCHEDULED_CLASSES,
    SEARCH_SCHEDULED_CLASSES_FOR_TEACHER,
    SEARCH_SCHEDULED_CLASSES_FOR_STUDENT,
    SEARCH_SCHEDULED_CLASS_BY_ID,
    DELETE_SCHEDULED_CLASS,
} = require('../db/schedule')
const db = require('../db/connect')
const asyncWrapper = require('../utils/asyncWrapper')

route.get(
    '/:id/',
    asyncWrapper(async (req, res) => {
        const class_id = req.params.id
        const user_id = req.id
        const role = req.role

        const class_exists = await db.query(SEARCH_CLASS_BY_UUID, [class_id])
        if (class_exists.rows.length === 0) {
            res.status(404).send({
                message: 'No such class found',
                statusCode: 404,
                status: 'Not found',
            })
            return
        }

        const { rows } = await db.query(SEARCH_CLASS_CREATOR, [class_id])
        if (rows[0].id !== user_id || role !== 'teacher') {
            res.status(403).send({
                message: 'Access denied for user',
            })
            return
        }

        const result = await db.query(SEARCH_SCHEDULED_CLASSES, [class_id])
        const scheduled_classes = result.rows

        res.status(200).send({
            scheduled_classes,
        })
    })
)

route.get(
    '/',
    asyncWrapper(async (req, res) => {
        const user_id = req.id
        const role = req.role

        let rows = []
        if (role === 'teacher') {
            result = await db.query(SEARCH_SCHEDULED_CLASSES_FOR_TEACHER, [
                user_id,
            ])
        } else {
            result = await db.query(SEARCH_SCHEDULED_CLASSES_FOR_STUDENT, [
                user_id,
            ])
        }

        const scheduled_classes = result.rows
        res.status(200).send({
            scheduled_classes,
        })
    })
)

route.post(
    '/schedule_class/:class_id/',
    asyncWrapper(async (req, res) => {
        const user_id = req.id
        const role = req.role
        const { class_id } = req.params
        const { offline_strength, start_time, topic } = req.body

        await ValidateScheduleClass.validateAsync({
            offline_strength,
            topic,
            start_time,
        })

        const { rows } = await db.query(SEARCH_CLASS_CREATOR, [class_id])
        if ((rows.length && rows[0].id !== user_id) || role !== 'teacher') {
            res.status(403).send({
                message: 'Access denied for user',
            })
            return
        }

        const result = await db.query(INSERT_INTO_SCHEDULED_CLASSES, [
            class_id,
            offline_strength,
            start_time,
            topic,
        ])

        const scheduled_class = result.rows[0]

        res.status(200).send({
            scheduled_class,
        })
    })
)

route.get(
    '/details/:id/',
    asyncWrapper(async (req, res) => {
        const { id } = req.params
        const { rows } = await db.query(SEARCH_SCHEDULED_CLASS_BY_ID, [id])
        res.status(200).send(rows[0])
    })
)

route.delete(
    '/delete/:id/',
    asyncWrapper(async (req, res) => {
        const schedule_id = req.params.id
        const role = req.role
        const user_id = req.id

        const { rows } = await db.query(SEARCH_SCHEDULED_CLASS_BY_ID, [
            schedule_id,
        ])
        if (rows.length === 0) {
            res.status(404).send({
                message: 'Class not scheduled yet',
                statusCode: 404,
            })

            return
        }

        const class_id = rows[0].class_id
        const result = await db.query(SEARCH_CLASS_CREATOR, [class_id])
        if (result.rows[0].id !== user_id || role !== 'teacher') {
            res.status(403).send({
                message: 'Access denied for user',
            })
            return
        }

        await db.query(DELETE_SCHEDULED_CLASS, [schedule_id])
        res.status(200).send({
            message: 'success',
        })
    })
)

module.exports = route
