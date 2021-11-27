const express = require('express')
const route = express.Router()
const {
    ValidateCreateClass,
    ValidateJoinClass,
    ValidateUpdate,
} = require('../utils/validate_class')
const { SEARCH_USER_BY_UUID, SEARCH_USER_BY_USERNAME } = require('../db/user')
const {
    INSERT_CLASS,
    SEARCH_CLASS_BY_SUBJECT,
    SEARCH_CLASS_BY_UUID,
    SEARCH_CLASS_BY_STUDENT,
    SEARCH_CLASS_BY_TEACHER,
    INSERT_STUDENTS,
    SEARCH_STUDENT_BY_CLASS_USER_ID,
    REMOVE_STUDENT_FROM_CLASS,
    GET_CLASS_DETAILS_BY_ID,
    UPDATE_CLASS_INFO,
} = require('../db/classes')
const db = require('../db/connect')
const asyncWrapper = require('../utils/asyncWrapper')

route.post(
    '/create_class/',
    asyncWrapper(async (req, res) => {
        const { subject, description } = req.body
        await ValidateCreateClass.validateAsync({
            subject,
            description,
        })

        const id = req.id
        const role = req.role

        if (role !== 'teacher') {
            res.status(403).send({
                message: 'Access denied for user',
            })
            return
        }

        let { rows } = await db.query(SEARCH_USER_BY_UUID, [id])
        const username = rows[0].username

        const dbResult = await db.query(INSERT_CLASS, [
            subject,
            description,
            username,
        ])

        rows = dbResult.rows
        const class_id = rows[0].id

        res.status(200).send({
            class_id,
            message: 'Class created successfully',
        })
    })
)

route.post(
    '/join_class/',
    asyncWrapper(async (req, res) => {
        const { subject } = req.body
        await ValidateJoinClass.validateAsync({
            subject,
        })

        const user_id = req.id
        const role = req.role

        const { rows } = await db.query(SEARCH_CLASS_BY_SUBJECT, [subject])

        if (rows.length === 0) {
            res.status(404).send({
                message: 'Class not found',
            })
            return
        }

        const class_id = rows[0].id

        await db.query(INSERT_STUDENTS, [class_id, user_id])

        res.status(200).send({
            user_id,
            role,
            class_id,
            message: 'Joined successfully',
        })
    })
)

route.delete(
    '/leave_class/:id',
    asyncWrapper(async (req, res) => {
        const user_id = req.id
        const class_id = req.params.id

        const user = await db.query(SEARCH_USER_BY_UUID, [user_id])
        if (user.rows.length === 0) {
            res.status(404).send({
                message: 'No user found',
                statusCode: 404,
                status: 'Not found',
            })
            return
        }

        const { rows } = await db.query(SEARCH_CLASS_BY_UUID, [class_id])
        if (rows.length === 0) {
            res.status(404).send({
                message: 'No such class found',
                statusCode: 404,
                status: 'Not found',
            })
            return
        }

        const dbResult = await db.query(SEARCH_STUDENT_BY_CLASS_USER_ID, [
            class_id,
            user_id,
        ])
        if (dbResult.rows.length === 0) {
            res.status(404).send({
                message: 'Class not joined by user',
                statusCode: 404,
                status: 'Not found',
            })
            return
        }

        await db.query(REMOVE_STUDENT_FROM_CLASS, [class_id, user_id])
        res.status(200).send({
            status: 'success',
        })
    })
)

route.get(
    '/my_classes/',
    asyncWrapper(async (req, res) => {
        const id = req.id
        const role = req.role

        let myclasses = []
        if (role === 'teacher') {
            const classes_per_teacher = await db.query(
                SEARCH_CLASS_BY_TEACHER,
                [id]
            )
            myclasses = classes_per_teacher.rows
        } else if (role === 'student') {
            const classes_per_student = await db.query(
                SEARCH_CLASS_BY_STUDENT,
                [id]
            )
            myclasses = classes_per_student.rows
        }

        res.status(200).send(myclasses)
    })
)

route.get(
    '/class/:id',
    asyncWrapper(async (req, res) => {
        const user_id = req.id
        const role = req.role
        const class_id = req.params.id

        let { rows } = await db.query(SEARCH_CLASS_BY_UUID, [class_id])
        if (rows.length === 0) {
            res.status(404).send({
                message: 'No such class found',
                statusCode: 404,
                status: 'Not found',
            })
            return
        }

        let member = 'false'
        if (role === 'student') {
            const result = await db.query(SEARCH_STUDENT_BY_CLASS_USER_ID, [
                class_id,
                user_id,
            ])
            if (result.rows.length !== 0) {
                member = 'true'
            }
        }

        const result = await db.query(GET_CLASS_DETAILS_BY_ID, [
            class_id,
            user_id,
        ])
        const classroom = result.rows[0]

        res.status(200).send({
            classroom,
            member,
        })
    })
)

route.get(
    '/myclasses/',
    asyncWrapper(async (req, res) => {
        const id = req.id
        const role = req.role

        let myclasses = []
        if (role === 'teacher') {
            const classes_per_teacher = await db.query(
                SEARCH_CLASS_BY_TEACHER,
                [id]
            )
            myclasses = classes_per_teacher.rows
        } else if (role === 'student') {
            const classes_per_student = await db.query(
                SEARCH_CLASS_BY_STUDENT,
                [id]
            )
            myclasses = classes_per_student.rows
        }

        res.status(200).send({
            myclasses,
        })
    })
)

route.get(
    '/class/:id',
    asyncWrapper(async (req, res) => {
        const user_id = req.id
        const role = req.role
        const class_id = req.params.id

        let { rows } = await db.query(SEARCH_CLASS_BY_UUID, [class_id])
        if (rows.length === 0) {
            res.status(404).send({
                message: 'No such class found',
                statusCode: 404,
                status: 'Not found',
            })
            return
        }

        let member = 'false'
        if (role === 'student') {
            const result = await db.query(SEARCH_STUDENT_BY_CLASS_USER_ID, [
                class_id,
                user_id,
            ])
            if (result.rows.length !== 0) {
                member = 'true'
            }
        }

        const result = await db.query(GET_CLASS_DETAILS_BY_ID, [
            class_id,
            user_id,
        ])
        const classroom = result.rows[0]

        res.status(200).send({
            classroom,
            member,
        })
    })
)

route.put(
    '/update/:id',
    asyncWrapper(async (req, res) => {
        const class_id = req.params.id
        const role = req.role
        const id = req.id

        const { description } = req.body
        await ValidateUpdate.validateAsync({
            description,
        })

        if (role !== 'teacher') {
            res.status(403).send({
                message: 'Access denied for user',
            })
            return
        }

        const user = await db.query(SEARCH_USER_BY_UUID, [id])
        const classcreator = await db.query(SEARCH_CLASS_BY_UUID, [class_id])

        if (
            user.rows.length === 0 ||
            user.rows[0].username !== classcreator.rows[0].created_by
        ) {
            res.status(403).send({
                message: 'Access denied for user',
            })
            return
        }

        const { rows } = await db.query(UPDATE_CLASS_INFO, [
            class_id,
            description,
        ])

        res.status(200).send({
            decription: rows[0].description,
        })
    })
)
module.exports = route
