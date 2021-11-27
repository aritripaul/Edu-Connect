const express = require('express')
const route = express.Router()
const db = require('../db/connect')
const asyncWrapper = require('../utils/asyncWrapper')
const {
    SEARCH_CLASS_CREATOR,
    UPDATE_STUDENT_VERIFICATION,
    SEARCH_STUDENTS_BY_VERIFICATION,
    DELETE_UNVERIFIED_STUDENT_BY_USERNAME,
    SEARCH_STUDENT_EXISTS_IN_CLASS,
} = require('../db/verification')

route.get(
    '/students/:id',
    asyncWrapper(async (req, res) => {
        let verified = req.query.verified
        const class_id = req.params.id

        const { rows } = await db.query(SEARCH_STUDENTS_BY_VERIFICATION, [
            class_id,
            verified,
        ])
        const verification = rows
        res.status(200).send({
            verification,
        })
    })
)
route.put(
    '/verify/:id',
    asyncWrapper(async (req, res) => {
        const class_id = req.params.id
        const user_id = req.id
        const role = req.role
        const { username, verify } = req.body

        const { rows } = await db.query(SEARCH_CLASS_CREATOR, [class_id])
        const creator = rows[0]
        if (role !== 'teacher' || user_id !== creator.id) {
            res.status(403).send({
                message: 'Access denied for user',
            })
            return
        }

        const student = await db.query(SEARCH_STUDENT_EXISTS_IN_CLASS, [
            class_id,
            username,
        ])

        if (student.rows.length === 0) {
            res.status(400).send({
                message: 'Student did not join class yet',
                statusCode: 400,
            })
        }

        if (verify !== true && verify !== false) {
            res.status(400).send({
                message: 'Bad request',
                statusCode: 400,
            })

            return
        }

        if (verify === false) {
            await db.query(DELETE_UNVERIFIED_STUDENT_BY_USERNAME, [
                username,
                class_id,
            ])
            res.status(200).send({
                message: 'Deleted unverified student',
            })
            return
        }

        const result = await db.query(UPDATE_STUDENT_VERIFICATION, [
            verify,
            class_id,
            username,
        ])
        res.status(200).send({
            message: 'Verification successful',
        })
    })
)

module.exports = route
