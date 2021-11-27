const jwt = require('jsonwebtoken')
const asyncWrapper = require('../utils/asyncWrapper')

module.exports = asyncWrapper(async (req, res, next) => {
    let token = req.headers.authorization

    if (!token) {
        res.status(401).send({
            message: 'No access token found',
        })
        return
    }

    token = token.split(' ')
    if (!(token.length === 2 && token[0] == 'Bearer')) {
        res.status(401).send({
            message: 'Badly Formatted Token',
        })
        return
    } else {
        token = token[1]
    }

    const result = await jwt.verify(token, process.env.JWT_ACCESS_SECRET)

    req.id = result.id
    req.role = result.role
    next()
})
