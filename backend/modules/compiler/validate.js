module.exports = (req) => {
    if (
        req.body.sourceCode === null ||
        req.body.sourceCode === null ||
        req.body.codeType === null
    )
        return {
            messege: 'Bad Request',
            status: '400',
            hints:
                'Source Code(sourceCode), inputs(inputs), code type(codeType) is required',
        }

    if (req.body.codeType < 1 || req.body.codeType > 4)
        return {
            messege: 'Bad Request',
            hints: 'Code Type must be an integer between [1,4]',
            status: '400',
        }

    if (isNaN(req.body.codeType))
        return {
            messege: 'Bad Request',
            hints: 'Code Type must be integer between [1,4]',
            status: '400',
        }

    if (
        typeof req.body.sourceCode !== 'string' ||
        typeof req.body.inputs !== 'string'
    )
        return {
            messege: 'Bad Request',
            hints: 'source code and inputs must be of type string type',
            status: '400',
        }

    if (req.body.sourceCode.length === 0)
        return {
            messege: 'Bad Request',
            hints: 'Source Code cannot be of length 0',
            status: '400',
        }

    return null
}
