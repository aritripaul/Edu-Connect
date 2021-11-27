module.exports.CHECK_STUDENT_EXISTS_IN_CLASS = `SELECT * FROM students WHERE user_id = $2 AND class_id = 
                                            (SELECT class_id FROM scheduled_classes WHERE schedule_id = $1);`

module.exports.INSERT_INTO_ATTENDANCE = `INSERT INTO attendance(user_id, schedule_id) VALUES($2, $1) RETURNING 
                                            user_id, schedule_id; `

module.exports.SEARCH_IF_SEAT_BOOKED = `SELECT * FROM attendance WHERE schedule_id = $1 AND user_id = $2;`
module.exports.DELETE_SEAT = `DELETE FROM attendance WHERE schedule_id = $1 AND user_id = $2;`

module.exports.SEARCH_OFFLINE_STUDENTS = `SELECT student.id, student.first_name, student.last_name, student.username,
                                            student.organization FROM users as student INNER JOIN attendance ON 
                                            attendance.user_id = student.id WHERE attendance.schedule_id = $1;`
