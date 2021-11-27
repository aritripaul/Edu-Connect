const express = require('express')
const mkdirp = require('mkdirp')
const fs = require('fs')
const { SEARCH_CLASS_BY_UUID, SEARCH_CLASS_CREATOR } = require('../db/classes')
const {
    SEARCH_ASSIGNMENTS_BY_CLASS_ID,
    INSERT_ASSIGNMENT_BY_CLASS_ID,
    UPDATE_ACTIVE_STATUS,
    SEARCH_ASSIGNMENTS_FOR_TEACHER,
    SEARCH_ASSIGNMENTS_FOR_STUDENTS,
    UPDATE_ASSIGNMENT_GRADE,
    SEARCH_ASSIGNMENT_BY_ASSIGNMENT_ID,
    SEARCH_STUDENT_BY_CLASS_USER_ID,
    INSERT_ASSIGNMENT_SUBMISSION,
    UPDATE_ASSIGNMENTS_BY_CONTENT,
    UPDATE_ASSIGNMENTS_SUBMISSIONS_BY_CONTENT,
    GET_FILE_PATH_BY_ID,
    DELETE_ASSIGNMENT,
    GET_SUBMISSION_FILE_PATH_BY_ID,
    SEARCH_SUBMISSION_BY_SUBMISSION_ID,
    DELETE_ASSIGNMENT_SUBMISSION,
    UPDATE_ASSIGNMENTS,
    GET_STUDENTS_WITH_SUBMITTED_ASSIGNMENT,

    SEARCH_IF_STUDENT_EXISTS,
} = require('../db/assignments')
const { GET_CURRENT_TIMESTAMP } = require('../db/user')
const route = express.Router()
const db = require('../db/connect')
const asyncWrapper = require('../utils/asyncWrapper')

//asignments of a given class
route.get(
    '/:id',
    asyncWrapper(async (req, res) => {
        const class_id = req.params.id

        const { rows } = await db.query(SEARCH_CLASS_BY_UUID, [class_id])
        if (rows.length === 0) {
            res.status(400).send({
                message: 'Class not found',
                statusCode: 400,
            })
        }

        const result = await db.query(SEARCH_ASSIGNMENTS_BY_CLASS_ID, [
            class_id,
        ])
        const assignments = result.rows

        assignments.map((assignment) => {
            const current_date = new Date()
            const end_date = new Date(assignment.end_date)

            if (current_date > end_date) {
                assignment.active_status = 'inactive'
                db.query(UPDATE_ACTIVE_STATUS, [assignment.id])
            }
        })

        res.status(200).send({
            assignments,
        })
    })
)

//assignments of user
route.get(
    '/',
    asyncWrapper(async (req, res) => {
        const user_id = req.id
        const role = req.role

        let dbresult = []

        if (role === 'teacher') {
            dbresult = await db.query(SEARCH_ASSIGNMENTS_FOR_TEACHER, [user_id])
        } else if (role === 'student') {
            dbresult = await db.query(SEARCH_ASSIGNMENTS_FOR_STUDENTS, [
                user_id,
            ])
        }

        const assignments = dbresult.rows
        res.status(200).send({
            assignments,
        })
    })
)

route.get(
    '/submissions/:id',
    asyncWrapper(async (req, res) => {
        const assignment_id = req.params.id
        const user_id = req.id
        const role = req.role

        const { rows } = await db.query(SEARCH_ASSIGNMENT_BY_ASSIGNMENT_ID, [
            assignment_id,
        ])
        if (rows.length === 0) {
            res.statud(404).send({
                message: 'Assignment does not exists',
            })
            return
        }

        const class_id = rows[0].class_id
        const dbresult = await db.query(SEARCH_CLASS_CREATOR, [class_id])
        if (role !== 'teacher' || dbresult.rows[0].id !== user_id) {
            res.status(403).send({
                message: 'Access denied for user',
                statusCode: 403,
            })
            return
        }

        const result = await db.query(GET_STUDENTS_WITH_SUBMITTED_ASSIGNMENT, [
            assignment_id,
        ])

        res.status(200).send({
            submission: result.rows,
        })
    })
)

//teacher uploads assignment
route.post(
    '/create/:id',
    asyncWrapper(async (req, res) => {
        const class_id = req.params.id
        const {
            assignment_name,
            assignment,
            start_date,
            end_date,
            description,
        } = req.body

        // console.log(file)

        const { rows } = await db.query(SEARCH_CLASS_CREATOR, [class_id])
        if (rows[0].id !== req.id) {
            res.status(403).send({
                message: 'Access denied for user',
                statusCode: 403,
            })
            return
        }

        const enddate = new Date(end_date)
        const startdate = new Date(start_date)
        const currentdate = new Date()

        if (enddate < startdate) {
            res.status(404).send({
                message: 'End date invalid',
                statusCode: 404,
            })
            return
        } else if (startdate < currentdate) {
            res.status(404).send({
                message: 'Start date invalid',
                statusCode: 404,
            })
            return
        }

        const result = await db.query(INSERT_ASSIGNMENT_BY_CLASS_ID, [
            class_id,
            assignment_name,
            start_date,
            end_date,
            description,
        ])

        const regex = /^data:.+\/(.+);base64,(.*)$/
        const matches = assignment.match(regex)
        const ext = matches[1]
        const data = matches[2]
        const buffer = Buffer.from(data, 'base64')

        const assignment_id = result.rows[0].id

        const dirpath = './public/assignments/' + assignment_id + '/'
        mkdirp.sync(dirpath)

        const filepath = dirpath + assignment_id + '.' + ext
        fs.writeFileSync(filepath, buffer)

        const dBresult = await db.query(UPDATE_ASSIGNMENTS_BY_CONTENT, [
            filepath,
        ])

        res.status(200).send({
            assignment_id: assignment_id,
            message: 'success',
        })
    })
)

//student submits assignment
route.post(
    '/submit/:id',
    asyncWrapper(async (req, res) => {
        const user_id = req.id
        const assignment_id = req.params.id
        const role = req.role

        const { rows } = await db.query(SEARCH_ASSIGNMENT_BY_ASSIGNMENT_ID, [
            assignment_id,
        ])
        if (rows.length === 0) {
            res.statud(404).send({
                message: 'Assignment does not exists',
            })
            return
        }

        const dbresult = await db.query(SEARCH_STUDENT_BY_CLASS_USER_ID, [
            assignment_id,
            user_id,
        ])

        if (role !== 'student' || dbresult.rows.length === 0) {
            res.status(403).send({
                message: 'Access denied for user',
                statusCode: 403,
            })
            return
        }

        const date = await db.query(GET_CURRENT_TIMESTAMP)
        const current_date = date.rows[0].current_time

        if (current_date < rows[0].start_date) {
            res.status(404).send({
                message: 'Assignment submission not started yet',
            })
            return
        }

        if (current_date > rows[0].end_date) {
            res.status(404).send({
                message: 'Assignment submission end date passed',
            })
            return
        }

        const { assignment } = req.body

        const result = await db.query(INSERT_ASSIGNMENT_SUBMISSION, [
            assignment_id,
            user_id,
        ])

        const regex = /^data:.+\/(.+);base64,(.*)$/
        const matches = assignment.match(regex)
        const ext = matches[1]
        const data = matches[2]
        const buffer = Buffer.from(data, 'base64')

        const submission_id = result.rows[0].submission_id

        const dirpath =
            './public/assignments/' + assignment_id + '/submissions/'
        mkdirp.sync(dirpath)

        const filepath = dirpath + submission_id + '.' + ext
        fs.writeFileSync(filepath, buffer)

        const dBresult = await db.query(
            UPDATE_ASSIGNMENTS_SUBMISSIONS_BY_CONTENT,
            [filepath]
        )

        res.status(200).send({
            submission_id: submission_id,
            message: 'success',
        })
    })
)

//teacher deletes assignment
route.delete(
    '/delete/:id',
    asyncWrapper(async (req, res) => {
        const assignment_id = req.params.id
        const user_id = req.id
        const role = req.role

        const { rows } = await db.query(SEARCH_ASSIGNMENT_BY_ASSIGNMENT_ID, [
            assignment_id,
        ])
        if (rows.length === 0) {
            res.statud(404).send({
                message: 'Assignment does not exist',
            })
            return
        }

        const class_id = rows[0].class_id
        const dbresult = await db.query(SEARCH_CLASS_CREATOR, [class_id])
        if (role !== 'teacher' || dbresult.rows[0].id !== user_id) {
            res.status(403).send({
                message: 'Access denied for user',
                statusCode: 403,
            })
            return
        }

        const result = await db.query(GET_FILE_PATH_BY_ID, [assignment_id])
        const filepath = result.rows[0].content

        fs.unlinkSync(filepath)
        await db.query(DELETE_ASSIGNMENT, [assignment_id])
        res.status(200).send({
            message: 'success',
        })
    })
)

//student deletes
route.delete(
    '/submission/delete/:id',
    asyncWrapper(async (req, res) => {
        const submission_id = req.params.id
        const user_id = req.id
        const role = req.role

        const { rows } = await db.query(SEARCH_SUBMISSION_BY_SUBMISSION_ID, [
            submission_id,
        ])
        if (rows.length === 0) {
            res.status(404).send({
                message: 'Submission does not exist',
            })
            return
        }

        const submitted_by = rows[0].submitted_by
        if (role !== 'student' || user_id !== submitted_by) {
            res.status(403).send({
                message: 'Access denied for user',
                statusCode: 403,
            })
            return
        }

        const current_date = new Date()

        if (current_date > rows[0].end_date) {
            res.status(404).send({
                message:
                    'Assignment submission end date passed, cannot delete file',
            })
            return
        }

        const result = await db.query(GET_SUBMISSION_FILE_PATH_BY_ID, [
            submission_id,
        ])
        const filepath = result.rows[0].content

        fs.unlinkSync(filepath)
        await db.query(DELETE_ASSIGNMENT_SUBMISSION, [submission_id])
        res.status(200).send({
            message: 'success',
        })
    })
)

//update assignment
route.put(
    '/update/:id',
    asyncWrapper(async (req, res) => {
        const { end_date, name, description } = req.body
        const assignment_id = req.params.id
        const user_id = req.id
        const role = req.role

        const { rows } = await db.query(SEARCH_ASSIGNMENT_BY_ASSIGNMENT_ID, [
            assignment_id,
        ])
        if (rows.length === 0) {
            res.statud(404).send({
                message: 'Assignment does not exists',
            })
            return
        }

        const class_id = rows[0].class_id
        const dbresult = await db.query(SEARCH_CLASS_CREATOR, [class_id])
        if (role !== 'teacher' || dbresult.rows[0].id !== user_id) {
            res.status(403).send({
                message: 'Access denied for user',
                statusCode: 403,
            })
            return
        }

        const current_start_date = rows[0].start_date
        if (new Date(end_date) < current_start_date) {
            res.status(404).send({
                message: 'End date cannot be before start date',
                statusCode: 404,
            })
            return
        }

        const result = await db.query(UPDATE_ASSIGNMENTS, [
            end_date,
            name,
            description,
            assignment_id,
        ])
        res.status(200).send({
            assignment_id: assignment_id,
            message: 'Updated successfully',
        })
    })
)

//put grade
route.put(
    '/grade/:id',
    asyncWrapper(async (req, res) => {
        const submission_id = req.params.id
        const dBresult = await db.query(SEARCH_SUBMISSION_BY_SUBMISSION_ID, [
            submission_id,
        ])
        if (dBresult.rows.length === 0) {
            res.status(404).send({
                message: 'submission does not exits',
            })
        }

        const assignment_id = dBresult.rows[0].assignment_id
        const user_id = req.id
        const role = req.role

        const { grade } = req.body

        const dbresult = await db.query(SEARCH_ASSIGNMENT_BY_ASSIGNMENT_ID, [
            assignment_id,
        ])
        if (dbresult.rows.length === 0) {
            res.status(404).send({
                message: 'assignment does not exists',
            })
        }

        const class_id = dbresult.rows[0].class_id

        const { rows } = await db.query(SEARCH_CLASS_CREATOR, [class_id])

        if (rows[0].id !== user_id || role !== 'teacher') {
            res.status(403).send({
                message: 'Access denied for user',
            })
            return
        }

        await db.query(UPDATE_ASSIGNMENT_GRADE, [submission_id, grade])

        res.status(200).send({
            message: 'success',
        })
    })
)
module.exports = route
