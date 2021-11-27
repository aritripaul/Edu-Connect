module.exports.SEARCH_CLASS_CREATOR = `SELECT teacher.id FROM classes as class INNER JOIN users as teacher ON class.created_by
                                        = teacher.username WHERE class.id = $1;`

module.exports.UPDATE_STUDENT_VERIFICATION = `UPDATE students SET verified = $1 WHERE class_id = $2 AND user_id = (SELECT id FROM 
                                                users WHERE username = $3) RETURNING class_id, user_id, verified;`

module.exports.SEARCH_STUDENTS_BY_VERIFICATION = `SELECT students.user_id, student.first_name as firstname, student.last_name as lastname, student.username
                                                as username, student.organization as organization FROM users as student INNER JOIN students 
                                                ON students.user_id = student.id WHERE students.class_id = $1 AND students.verified = $2; `

module.exports.DELETE_UNVERIFIED_STUDENT_BY_USERNAME = `DELETE FROM students WHERE class_id = $2 AND user_id = (SELECT id FROM users
                                                        WHERE username = $1);`

module.exports.SEARCH_STUDENT_EXISTS_IN_CLASS = `SELECT student.username FROM users as student INNER JOIN students ON student.id = 
                                                students.user_id WHERE student.username = $2 AND students.class_id = $1`
