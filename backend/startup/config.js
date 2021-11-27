module.exports = function () {
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

    if (!JWT_ACCESS_SECRET)
        throw new Error('FATAL ERROR: JWT_ACCESS_SECRET is not defined')
    if (!JWT_REFRESH_SECRET)
        throw new Error('FATAL ERROR: JWT_REFRESH_SECRET is not defined')
}
