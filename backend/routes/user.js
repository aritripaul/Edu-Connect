const express = require('express')
const route = express.Router()
const asyncWrapper = require('../utils/asyncWrapper')
const { updateValidate } = require('../utils/validate_user')
const { UPDATE_USER_INFO, SEARCH_USER_BY_UUID } = require('../db/user')
const db = require('../db/connect')
const { response } = require('express')

route.get(
    '/me/',
    asyncWrapper(async (req, res) => {
        const id = req.id

        const { rows } = await db.query(SEARCH_USER_BY_UUID, [id])

        if (rows.length === 0) {
            res.status(404).send({
                message: 'No user found',
                statusCode: 404,
                status: 'Not found',
            })
        }

        res.status(200).send(rows[0])
    })
)

route.put(
    '/update/',
    asyncWrapper(async (req, res) => {
        const id = req.id
        const { first_name, last_name, organization } = req.body
        await updateValidate.validateAsync({
            organization,
            first_name,
            last_name,
        })
        const { rows } = await db.query(SEARCH_USER_BY_UUID, [id])
        if (rows.length === 0) {
            res.status(404).send({
                message: 'No user found',
                statusCode: 404,
                status: 'Not found',
            })
        }
        let result = await db.query(UPDATE_USER_INFO, [
            first_name,
            last_name,
            organization,
            id,
        ])
        result = result.rows[0]

        const response = {
            first_name: result.first_name,
            last_name: result.last_name,
            organization: result.organization,
        }
        res.status(200).send(response)
    })
)

module.exports = route
