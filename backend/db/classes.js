module.exports.INSERT_CLASS = `INSERT INTO classes (subject, description, created_by)
                                VALUES ($1, $2, $3) RETURNING id, subject, description, created_by, 
                                number_of_students, created_on;`

module.exports.SEARCH_CLASS_BY_SUBJECT = `SELECT  id, subject, description, created_by, 
                                            number_of_students, created_on FROM classes WHERE subject = $1;`

module.exports.SEARCH_CLASS_BY_UUID = `SELECT  id, subject, description, created_by, 
                                            number_of_students, created_on FROM classes WHERE id = $1;`

module.exports.INSERT_STUDENTS = `INSERT INTO students (class_id, user_id) VALUES ($1, $2) RETURNING
                                        class_id, user_id;`

module.exports.SEARCH_CLASS_BY_SUBJECT = `SELECT  id, subject, description, created_by, 
                                        number_of_students, created_on FROM classes WHERE subject = $1;`

module.exports.SEARCH_STUDENT_BY_CLASS_USER_ID = `SELECT class_id, user_id, verified FROM students WHERE class_id = $1 
                                                    AND user_id = $2`

module.exports.REMOVE_STUDENT_FROM_CLASS = `DELETE FROM students WHERE class_id = $1 AND user_id = $2;`

module.exports.SEARCH_CLASS_BY_TEACHER = `SELECT class.*, teacher.first_name as teacher_first_name, teacher.last_name 
                                        as teacher_last_name, teacher.email as teacher_email FROM classes as class INNER JOIN 
                                        users as teacher ON class.created_by = teacher.username WHERE class.created_by = 
                                        (SELECT username FROM users WHERE id = $1); `

module.exports.SEARCH_CLASS_BY_STUDENT = `SELECT class.*, teacher.first_name as teacher_first_name, teacher.last_name 
                                        as teacher_last_name, teacher.email as teacher_email, (CASE WHEN EXISTS (SELECT students.user_id FROM students WHERE students.class_id = class.id 
                                            AND user_id = $1 AND students.verified = true) THEN true ELSE false END) as verified FROM classes as class INNER JOIN 
                                        users as teacher ON class.created_by = teacher.username WHERE class.id IN (SELECT class_id FROM 
                                        students WHERE user_id = $1); `

module.exports.GET_CLASS_DETAILS_BY_ID = `SELECT class.*, teacher.first_name as teacher_first_name, teacher.last_name 
                                         as teacher_last_name, teacher.email as teacher_email, teacher.organization as teacher_organization,
                                         (CASE WHEN EXISTS (SELECT students.user_id FROM students WHERE students.class_id = $1 
                                            AND user_id = $2 AND students.verified = true) THEN true ELSE false END) as verified
                                         FROM classes as class INNER JOIN users as teacher ON class.created_by = teacher.username WHERE class.id = $1;`

module.exports.UPDATE_CLASS_INFO = `UPDATE classes SET description = $2 WHERE id = $1 RETURNING id, description;`

module.exports.SEARCH_CLASS_CREATOR = `SELECT teacher.id FROM users as teacher INNER JOIN classes ON teacher.username = classes.created_by
                                        WHERE classes.id = $1;`

module.exports.SEARCH_STUDENTS_FROM_CLASS = `SELECT student.first_name, student.last_name, student.username,student.organization FROM users 
                                            as student INNER JOIN students ON students.user_id = student.id WHERE students.class_id = $1;`
