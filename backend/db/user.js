const jwt = require('jsonwebtoken')

// CREATE OPERATIONS
module.exports.INSERT_USER = `INSERT INTO 
                                users (employee_id, first_name, last_name, email, organization, username, password, role)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING employee_id, username, id, first_name, last_name, email, organization, role;`

// READ OPERATIONS
module.exports.SEARCH_USER_BY_USERNAME = `SELECT * FROM users WHERE username = $1 OR email = $1 OR username = $2 OR email = $2;`
module.exports.SEARCH_USER_BY_UUID = `SELECT id, employee_id, username,role, first_name, last_name, email, organization, username,  verified, joined_on FROM users WHERE id = $1;`

// UPDATE OPERATIONS
module.exports.UPDATE_USER_INFO = `UPDATE users 
                                    SET first_name = $1,
                                    last_name = $2,
                                    organization = $3
                                    WHERE id = $4
                                    RETURNING username, id, first_name, last_name, organization;`

module.exports.UPDATE_USER_VERIFICATION = `UPDATE users 
                                       SET verified = $1
                                       WHERE id = $2;`

module.exports.UPDATE_USER_PASSWORD = `UPDATE users 
                                        SET password = $1
                                        WHERE id = $2;`

// DELETE OPERATIONS
module.exports.DELETE_USER_BY_UUID = 'DELETE FROM users WHERE uuid = $1;'
module.exports.DELETE_USER_BY_USERNAME =
    'DELETE FROM users WHERE username = $1 OR email = $1;'

module.exports.GET_CURRENT_TIMESTAMP = `SELECT current_timestamp;`

// JWT SIGN
module.exports.generateAuthTokens = (id, role) => {
    const accessToken = jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: 3600,
    })

    const refreshToken = jwt.sign(
        { id, role },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: 60 * 60 * 24 * 30,
        }
    )

    return { accessToken, refreshToken }
}

module.exports.generateAccessToken = (id, role) => {
    const accessToken = jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: 3600,
    })

    return accessToken
}
