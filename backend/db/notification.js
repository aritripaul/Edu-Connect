module.exports.GET_NOTIFICATION = `SELECT * FROM notification where class_id = $1 ORDER BY posted_on DESC`
module.exports.POST_NOTIFICATION = `INSERT INTO notification(class_id, user_id, message, username) VALUES ($1, $2, $3, $4) RETURNING *`
module.exports.GET_NOTIFICATION_BY_ID = `SELECT * from notification where notification_id = $1`
module.exports.DELETE_NOTIFICATION = `DELETE FROM notification WHERE notification_id = $1`
