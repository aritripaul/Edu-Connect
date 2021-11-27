const express = require('express')
const compiler = require('../modules/compiler/compile')
const validate = require('../modules/compiler/validate')
const route = express.Router()

route.post('/', async (req, res) => {
    const result = validate(req)
    if (result) {
        return res.status(400).send(result)
    }

    try {
        const data = await compiler(
            req.body.sourceCode,
            req.body.inputs,
            req.body.codeType
        )
        if (data.error.length) data.stderr = `${data.error}\n${data.stderr}`
        data['date_compiled'] = new Date()
        res.status(200).send(data)
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = route
