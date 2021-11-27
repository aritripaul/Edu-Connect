const express = require('express')
const route = express.Router()
const db = require('../db/connect')
const asyncWrapper = require('../utils/asyncWrapper')

const { GET_CURRENT_TIMESTAMP } = require('../db/user')
const {
    SEARCH_SCHEDULED_CLASS_BY_ID,
    GET_OFFLINE_STRENGTH,
} = require('../db/schedule')

const {
    CHECK_STUDENT_EXISTS_IN_CLASS,
    INSERT_INTO_ATTENDANCE,
    DELETE_SEAT,
    SEARCH_IF_SEAT_BOOKED,
    SEARCH_OFFLINE_STUDENTS,
} = require('../db/attendance')

const { SEARCH_STUDENTS_FROM_CLASS } = require('../db/classes')

route.post(
    '/book/:s_id',
    asyncWrapper(async (req, res) => {
        const user_id = req.id
        const role = req.role
        const schedule_id = req.params.s_id

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

        const dbresult = await db.query(CHECK_STUDENT_EXISTS_IN_CLASS, [
            schedule_id,
            user_id,
        ])
        console.log(dbresult.rows)
        if (role !== 'student' || dbresult.rows.length === 0) {
            res.status(403).send({
                message: 'Access denied',
                statusCode: 403,
            })
            return
        }
        const time = await db.query(GET_CURRENT_TIMESTAMP)
        const current_time = time.rows[0].current_timestamp
        const class_start_time = rows[0].start_time

        if (current_time > class_start_time) {
            res.status(404).send({
                message: 'Class started',
                statusCode: 404,
            })
            return
        }
        const dBresult = await db.query(GET_OFFLINE_STRENGTH, [schedule_id])
        const offline_strength = dBresult.rows[0].offline_strength
        if (offline_strength <= 0) {
            res.status(200).send({
                message: 'No more seats left',
            })
            return
        }

        const result = await db.query(INSERT_INTO_ATTENDANCE, [
            schedule_id,
            user_id,
        ])
        res.status(200).send({
            message: 'success',
            offline_strength: offline_strength - 1,
        })
    })
)

route.delete(
    '/cancel/:s_id',
    asyncWrapper(async (req, res) => {
        const user_id = req.id
        const role = req.role
        const schedule_id = req.params.s_id

        const { rows } = await db.query(SEARCH_SCHEDULED_CLASS_BY_ID, [
            schedule_id,
        ])
        if (rows.length === 0) {
            res.status(404).send({
                message: 'Scheuled class does not exist',
            })

            return
        }

        const dbresult = await db.query(SEARCH_IF_SEAT_BOOKED, [
            schedule_id,
            user_id,
        ])
        if (dbresult.rows.length === 0) {
            res.status(404).send({
                message: 'Seat not booked yet',
                statusCode: 404,
            })
            return
        }

        await db.query(DELETE_SEAT, [schedule_id, user_id])
        res.status(200).send({
            message: 'success',
        })
    })
)

route.get(
    '/:s_id',
    asyncWrapper(async (req, res) => {
        const user_id = req.id
        const role = req.role
        const schedule_id = req.params.s_id

        const { rows } = await db.query(SEARCH_SCHEDULED_CLASS_BY_ID, [
            schedule_id,
        ])
        if (rows.length === 0) {
            res.status(404).send({
                message: 'Scheuled class does not exist',
            })

            return
        }

        const offline_students = await db.query(SEARCH_OFFLINE_STUDENTS, [
            schedule_id,
        ])
        const class_id = rows[0].class_id
        const all_students = await db.query(SEARCH_STUDENTS_FROM_CLASS, [
            class_id,
        ])

        const online_students = all_students.rows.filter((item) => {
            return !offline_students.rows.some((obj) => {
                return obj.username === item.username
            })
        })

        if (role === 'teacher') {
            res.status(200).send({
                offline_students: offline_students.rows,
                online_students: online_students,
                offline_availability: rows[0].offline_strength,
            })
        } else {
            res.status(200).send({
                offline_availability: rows[0].offline_strength,
            })
        }
    })
)

module.exports = route
