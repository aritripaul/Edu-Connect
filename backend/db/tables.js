const db = require('./connect')

module.exports.CREATE_UUID_EXTENSION = async () => {
    try {
        const res = await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
        const res1 = await db.query(`CREATE EXTENSION IF NOT EXISTS citext`)

        const error = null
        return { res, error }
    } catch (err) {
        const res = null
        const ext = null

        return { res, err }
    }
}

module.exports.CREATE_EMPLOYEE_IDS_TABLE = async () => {
    try {
        const res = await db.query(
            `CREATE TABLE IF NOT EXISTS employee_ids ( 
            id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4 (), 
            employee_id VARCHAR UNIQUE DEFAULT NULL);`,
            []
        )
        const error = null
        return { res, error }
    } catch (err) {
        const res = null

        return { res, err }
    }
}

module.exports.CREATE_USER_TABLE = async () => {
    try {
        const res = await db.query(
            `CREATE TABLE IF NOT EXISTS users ( 
            id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4 (), 
            employee_id VARCHAR DEFAULT NULL,
            first_name VARCHAR NOT NULL, 
            last_name VARCHAR NOT NULL, 
            username VARCHAR UNIQUE NOT NULL, 
            password VARCHAR NOT NULL,
            email VARCHAR UNIQUE NOT NULL,
            joined_on DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            role VARCHAR NOT NULL DEFAULT 'student',
            organization VARCHAR NOT NULL,
            verified BOOLEAN DEFAULT 'false',
            constraint fk_users_employee_id
            FOREIGN KEY (employee_id)
            REFERENCES employee_ids (employee_id)
            ON DELETE NO ACTION);`,
            []
        )
        const error = null
        return { res, error }
    } catch (err) {
        const res = null
        console.log(err)
        return { res, err }
    }
}

module.exports.CREATE_CLASS_TABLE = async () => {
    try {
        const res = await db.query(
            `CREATE TABLE IF NOT EXISTS classes ( 
            id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4 (),  
            subject VARCHAR UNIQUE NOT NULL,
            description VARCHAR NOT NULL,
            created_by VARCHAR NOT NULL,
            number_of_students INTEGER DEFAULT 0,
            created_on DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            constraint fk_users_teachers
            FOREIGN KEY (created_by)
            REFERENCES users (username)
            ON DELETE NO ACTION);`,
            []
        )
        const error = null
        return { res, error }
    } catch (err) {
        const res = null
        console.log(err)
        return { res, err }
    }
}

module.exports.CREATE_STUDENTS_TABLE = async () => {
    try {
        const res = await db.query(
            `CREATE TABLE IF NOT EXISTS students( 
                class_id uuid NOT NULL,  
                user_id uuid NOT NULL, 
                verified BOOLEAN DEFAULT false,
                UNIQUE (class_id, user_id),
                constraint fk_class_id
                FOREIGN KEY (class_id)
                REFERENCES classes (id)
                ON DELETE CASCADE,
                constraint fk_user_id
                FOREIGN KEY (user_id)
                REFERENCES users (id)
                ON DELETE CASCADE
                );`,
            []
        )
        const error = null

        return { res, error }
    } catch (err) {
        const res = null
        console.log(err)
        return { res, err }
    }
}

module.exports.CREATE_ASSIGNMENTS_TABLE = async () => {
    try {
        const res = await db.query(
            `CREATE TABLE IF NOT EXISTS assignments( 
                id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4 (),
                class_id uuid NOT NULL,  
                name VARCHAR NOT NULL,
                description VARCHAR,
                start_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                end_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                content VARCHAR DEFAULT NULL,
                active_status VARCHAR NOT NULL DEFAULT 'active',
                constraint fk_class_id_assignments
                FOREIGN KEY (class_id)
                REFERENCES classes (id)
                ON DELETE CASCADE
                );`,
            []
        )
        const error = null
        return { res, error }
    } catch (err) {
        const res = null
        console.log(err)
        return { res, err }
    }
}
module.exports.CREATE_ASSIGNMENTS_SUBMISSIONS_TABLE = async () => {
    try {
        const res = await db.query(
            `CREATE TABLE IF NOT EXISTS assignments_submissions( 
                submission_id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4 (),
                assignment_id uuid UNIQUE NOT NULL,  
                submitted_by uuid UNIQUE NOT NULL,
                submitted_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                content VARCHAR,
                grade VARCHAR DEFAULT NULL,
                constraint fk_class_id_assignments
                FOREIGN KEY (assignment_id)
                REFERENCES assignments (id)
                ON DELETE CASCADE,
                constraint fk_user_id_assignments
                FOREIGN KEY (submitted_by)
                REFERENCES users (id)
                ON DELETE CASCADE
                );`,
            []
        )
        const error = null

        return { res, error }
    } catch (err) {
        const res = null
        console.log(err)
        return { res, err }
    }
}

//create trigger
module.exports.CREATE_TRIGGER_FOR_STUDENTS = async () => {
    try {
        const res = await db.query(
            `DROP FUNCTION IF EXISTS class_students_trigger() CASCADE;
            CREATE FUNCTION class_students_trigger() RETURNS trigger AS $$
            begin
                IF (TG_OP = 'DELETE') THEN
                    UPDATE classes SET number_of_students = number_of_students - 1 WHERE id = old.class_id;
                    RETURN old;
                
                ELSIF (TG_OP = 'INSERT') THEN
                    UPDATE classes SET number_of_students = number_of_students + 1 WHERE id = new.class_id;
                    RETURN new;

                END IF;
                RETURN NULL;         
                
            end
            $$ LANGUAGE plpgsql;
            
            DROP TRIGGER IF EXISTS numberOfStudents ON students;
            CREATE TRIGGER numberOfStudents AFTER INSERT OR DELETE
                ON students FOR EACH ROW EXECUTE PROCEDURE class_students_trigger();

            `
        )
        const error = null
        return { res, error }
    } catch (err) {
        const res = null
        const ext = null
        console.log(err)
        return { res, err }
    }
}

module.exports.CREATE_TABLE_FOR_SCHEDULED_CLASSES = async () => {
    try {
        const res = await db.query(
            `CREATE TABLE IF NOT EXISTS scheduled_classes( 
                schedule_id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4 (),
                class_id uuid NOT NULL,  
                offline_strength INTEGER DEFAULT 0,
                start_time TIMESTAMPTZ NOT NULL,
                topic VARCHAR, 
                UNIQUE (class_id, start_time),
                constraint fk_class_id_scheduled_classes
                FOREIGN KEY (class_id)
                REFERENCES classes (id)
                ON DELETE CASCADE
                );`,
            []
        )
        const error = null
        return { res, error }
    } catch (err) {
        const res = null
        console.log(err)
        return { res, err }
    }
}

module.exports.CREATE_ATTENDANCE_TABLE = async () => {
    try {
        const res = await db.query(
            `CREATE TABLE IF NOT EXISTS attendance( 
                user_id uuid NOT NULL, 
                schedule_id uuid NOT NULL,
                PRIMARY KEY (user_id, schedule_id),
                UNIQUE (user_id, schedule_id), 
                constraint fk_schedule_user
                FOREIGN KEY (schedule_id) 
                REFERENCES scheduled_classes (schedule_id)
                ON DELETE CASCADE 
                );`,
            []
        )
        const error = null
        return { res, error }
    } catch (err) {
        const res = null
        console.log(err)
        return { res, err }
    }
}

module.exports.CREATE_NOTIFICATION_TABLE = async () => {
    try {
        const res = await db.query(
            `CREATE TABLE IF NOT EXISTS notification( 
            notification_id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4 (),
            class_id uuid NOT NULL,  
            posted_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            user_id uuid NOT NULL,
            username VARCHAR,
            message text NOT NULL, 
            constraint fk_class_id_notification
            FOREIGN KEY (class_id)
            REFERENCES classes (id)
            ON DELETE CASCADE,
            constraint fk_user_id_notification
            FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,
            constraint fk_username_notification
            FOREIGN KEY (username)
            REFERENCES users (username)
            ON DELETE CASCADE
            );`,
            []
        )
    } catch (err) {
        const res = null
        console.log(err)
        return { res, err }
    }
}

//create trigger
module.exports.CREATE_TRIGGER_FOR_ATTENDANCE = async () => {
    try {
        const res = await db.query(
            `DROP FUNCTION IF EXISTS scheduled_class_attendance_trigger() CASCADE;
            CREATE FUNCTION scheduled_class_attendance_trigger() RETURNS trigger AS $$
            begin
                IF (TG_OP = 'DELETE') THEN
                    UPDATE scheduled_classes SET offline_strength = offline_strength + 1 WHERE schedule_id = old.schedule_id;
                    RETURN old;
                
                ELSIF (TG_OP = 'INSERT') THEN
                    UPDATE scheduled_classes SET offline_strength = offline_strength - 1 WHERE schedule_id = new.schedule_id;
                    RETURN new;

                END IF;
                RETURN NULL;        
                
            end 
            $$ LANGUAGE plpgsql; 
            
            DROP TRIGGER IF EXISTS offlineStrength ON attendance; 
            CREATE TRIGGER offlineStrength AFTER INSERT OR DELETE  
                ON attendance FOR EACH ROW EXECUTE PROCEDURE scheduled_class_attendance_trigger();

            `
        )
        const error = null
        return { res, error }
    } catch (err) {
        const res = null
        const ext = null
        console.log(err)
        return { res, err }
    }
}

module.exports.CREATE_NOTIFICATION_TABLE = async () => {
    try {
        const res = await db.query(
            `CREATE TABLE IF NOT EXISTS notification( 
            notification_id uuid PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4 (),
            class_id uuid NOT NULL,  
            posted_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            user_id uuid NOT NULL,
            username VARCHAR,
            message text NOT NULL, 
            constraint fk_class_id_notification
            FOREIGN KEY (class_id)
            REFERENCES classes (id)
            ON DELETE CASCADE,
            constraint fk_user_id_notification
            FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,
            constraint fk_username_notification
            FOREIGN KEY (username)
            REFERENCES users (username)
            ON DELETE CASCADE
            );`,
            []
        )
    } catch (err) {
        const res = null
        console.log(err)
        return { res, err }
    }
}
