module.exports.SEARCH_ASSIGNMENTS_BY_CLASS_ID = `SELECT * FROM assignments WHERE class_id = $1;`

module.exports.INSERT_ASSIGNMENT_BY_CLASS_ID = `INSERT INTO assignments(class_id, name, start_date, end_date, description) VALUES
                                                ($1, $2, $3, $4, $5) RETURNING id, class_id, name, start_date, end_date, description 
                                                active_status, content;`

module.exports.UPDATE_ACTIVE_STATUS = `UPDATE assignments SET active_status = 'inactive' WHERE id = $1;`

module.exports.SEARCH_ASSIGNMENTS_FOR_TEACHER = `SELECT assignments.*, classes.created_by, classes.subject,  FALSE as pending FROM assignments INNER JOIN classes ON classes.id = 
                                                assignments.class_id WHERE classes.id IN (SELECT class.id FROM classes as class
                                                INNER JOIN users as teacher ON teacher.username = class.created_by WHERE
                                                teacher.id = $1);`

module.exports.SEARCH_ASSIGNMENTS_FOR_STUDENTS = `SELECT assignments.*, classes.created_by, classes.subject, (CASE WHEN EXISTS (SELECT assignment_id FROM assignments_submissions 
                                                WHERE assignment_id = assignments.id AND submitted_by = $1) THEN FALSE ELSE TRUE END) AS pending,
                                                (SELECT submission_id FROM assignments_submissions 
                                                    WHERE assignment_id = assignments.id AND submitted_by = $1) as submission,
                                                    (SELECT grade FROM assignments_submissions 
                                                        WHERE assignment_id = assignments.id AND submitted_by = $1) as grade
                                                FROM assignments INNER JOIN classes ON classes.id = assignments.class_id WHERE classes.id IN 
                                                (SELECT class_id FROM students WHERE user_id = $1);`

module.exports.SEARCH_ASSIGNMENT_SUBMISSION_BY_ID = `SELECT * FROM assignments_submissions WHERE assignment_id = $1 AND 
                                                    submitted_by = $2;`

module.exports.SEARCH_STUDENT_BY_CLASS_USER_ID = `SELECT * FROM students WHERE class_id = (SELECT class_id FROM assignments WHERE id = $1)
                                                    AND user_id = $2;`

module.exports.SEARCH_SUBMISSION_BY_SUBMISSION_ID = `SELECT * FROM assignments_submissions WHERE submission_id = $1;`
module.exports.SEARCH_ASSIGNMENT_BY_ASSIGNMENT_ID = `SELECT * FROM assignments WHERE id = $1;`
module.exports.INSERT_ASSIGNMENT_SUBMISSION = `INSERT INTO assignments_submissions(assignment_id, submitted_by) VALUES($1, $2)
                                                RETURNING *;`

module.exports.UPDATE_ASSIGNMENTS = `UPDATE assignments SET end_date = $1, name = $2, description = $3 WHERE id = $4;`
module.exports.UPDATE_ASSIGNMENT_GRADE = `UPDATE assignments_submissions SET grade = $2 WHERE submission_id = $1;`

module.exports.UPDATE_ASSIGNMENTS_BY_CONTENT = `UPDATE assignments SET content = $1 RETURNING content;`
module.exports.UPDATE_ASSIGNMENTS_SUBMISSIONS_BY_CONTENT = `UPDATE assignments_submissions SET content = $1 RETURNING content;`
module.exports.GET_FILE_PATH_BY_ID = `SELECT content FROM assignments WHERE id = $1;`
module.exports.GET_SUBMISSION_FILE_PATH_BY_ID = `SELECT content FROM assignments_submissions WHERE submission_id = $1;`

module.exports.DELETE_ASSIGNMENT = `DELETE FROM assignments WHERE id = $1;`
module.exports.DELETE_ASSIGNMENT_SUBMISSION = `DELETE FROM assignments_submissions WHERE submission_id = $1;`

module.exports.GET_STUDENTS_WITH_SUBMITTED_ASSIGNMENT = `SELECT student.first_name, student.last_name, student.username, student.
                                                        organization, assignment.submitted_on, assignment.submission_id, assignment.grade, assignment.content 
                                                        FROM users as student INNER JOIN assignments_submissions as assignment ON 
                                                        assignment.submitted_by = student.id WHERE assignment.assignment_id = $1; `
