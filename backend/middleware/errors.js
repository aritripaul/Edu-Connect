module.exports = function (err, req, res, next) {
    let statusCode = err.status ? err.status : 500

    // JOI ERROR
    if (err.details && err.details.length && err.details[0].message) {
        err = err.details[0].message
        statusCode = 404
        err = {
            message: err,
        }
    }

    // Jwt error
    if (err.name) {
        statusCode = 401
        err = {
            message: err.message,
        }
    }

    // Db error
    if (err.detail && typeof err.detail === 'string') {
        statusCode = 502

        err = {
            message: err.detail,
        }
    }

    if (
        err.message.includes(
            'violates foreign key constraint "fk_users_employee_id"'
        )
    ) {
        err = {
            message: 'Un-Authorized Employee Id',
        }
    }

    if (
        err.message.includes(
            'violates unique constraint "students_class_id_key"'
        )
    ) {
        err = {
            message: 'Class already joined',
        }
    }

    res.status(statusCode).send(err)
}
