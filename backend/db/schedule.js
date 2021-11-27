module.exports.INSERT_INTO_SCHEDULED_CLASSES = `INSERT INTO scheduled_classes (class_id, offline_strength, start_time, topic)
                                                VALUES ($1, $2, $3, $4) RETURNING schedule_id, class_id, offline_strength,  start_time, 
                                                topic;`

module.exports.SEARCH_SCHEDULED_CLASSES = `SELECT * FROM scheduled_classes WHERE class_id = $1 ORDER BY start_time;`
module.exports.SEARCH_SCHEDULED_CLASSES_BY_ID = `SELECT * FROM scheduled_classes WHERE schedule_id = $1;`
module.exports.SEARCH_SCHEDULED_CLASSES_FOR_TEACHER = `SELECT schedule.*, classes.subject as classname, classes.created_by as teacher_username FROM 
                                                        scheduled_classes as schedule INNER JOIN classes ON schedule.class_id = classes.id WHERE class_id 
                                                        IN (SELECT classes.id as class_id FROM users INNER JOIN classes ON classes.created_by = 
                                                        users.username WHERE users.id = $1) ORDER BY start_time; `

module.exports.SEARCH_SCHEDULED_CLASSES_FOR_STUDENT = `SELECT schedule.*, classes.subject as classname, classes.created_by as teacher_username,
                                                        (CASE WHEN EXISTS (SELECT user_id FROM attendance WHERE attendance.schedule_id = schedule.schedule_id AND attendance.user_id = $1) THEN true ELSE false END) as attending_offline FROM 
                                                        scheduled_classes as schedule INNER JOIN classes ON schedule.class_id = classes.id WHERE class_id 
                                                        IN (SELECT class_id FROM students WHERE user_id = $1) ORDER BY start_time; `

module.exports.SEARCH_SCHEDULED_CLASS_BY_ID = `SELECT * FROM scheduled_classes WHERE schedule_id = $1;`
module.exports.DELETE_SCHEDULED_CLASS = `DELETE FROM scheduled_classes WHERE schedule_id = $1;`
module.exports.GET_OFFLINE_STRENGTH = `SELECT offline_strength FROM scheduled_classes WHERE schedule_id = $1;`
