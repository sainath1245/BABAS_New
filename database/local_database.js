// Table and queries for USERS
export const createUserTabel_1 = ((db) => {
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='user'",
            [],
            function (tx, res) {
                console.log('item:', res.rows.length);
                if (res.rows.length == 0) {
                    console.log("already created");
                    txn.executeSql('DROP TABLE IF EXISTS user', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, userId VARCHAR(20), token VARCHAR(50), firstName VARCHAR(50), lastName VARCHAR(50), email VARCHAR(50), userRole VARCHAR(50), desigination VARCHAR(50), location VARCHAR(50))',
                        []
                    );
                } else {
                    console.log("User Table created");
                }
            }
        );
    });
})

export const insertUser_1 = ((db, userId, token, firstName, lastName, email, userRole, desigination, location) => {
    db.transaction(function (tx) {
        tx.executeSql(
            'INSERT INTO user (userId, token, firstName, lastName, email, userRole, desigination, location) VALUES (?,?,?,?,?,?,?,?)',
            [userId, token, firstName, lastName, email, userRole, desigination, location],
            (tx, results) => {
                console.log('Results;;;  ', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    console.log('User Data Added Successfully :: ' + userId);
                } else {
                    console.log('Failed');
                }
            }
        );
    });
})

export const updateUser = ((db, desigination, location, userId) => {
    console.log('Results;;;  update :::: ', desigination, location, userId);
    db.transaction(function (tx) {
        tx.executeSql(
            'UPDATE user SET desigination = ? , location = ? WHERE userId = ?',
            [desigination, location, userId],
            (tx, results) => {
                console.log('Results;;;  update :::: ', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    console.log('User Data Added Successfully :: ' + userId);
                } else {
                    console.log('Failed');
                }
            }
        );
    });
})

export const getUsersFromLocalDB = async (db) => {
    const temp = [];
    await db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM user',
            [],
            (tx, results) => {
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                }
                console.log('first time' + temp[0].email);
                console.log('=== :: ' + temp[0].email)
            }
        );
    });
    return temp;
}

export const deleteTableAllRows = ((db) => {
    db.transaction(function (tx) {
        tx.executeSql(
            'DELETE FROM user',
            [],
            (tx, results) => {
                console.log('result  :::  ' + results.rowsAffected);
                if (results.rowsAffected > 0) {
                    console.log('User Data removed Successfully :: ');
                } else {
                    console.log('Failed');
                }
            }
        );
    })
})

// Table & quries for Clock In/Out
export const createClockTabel = ((db) => {
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='CLOCK_DATA'",
            [],
            function (tx, res) {
                console.log('item:', res.rows.length);
                if (res.rows.length == 0) {
                    console.log("already created  - CLOCK TABLE");
                    txn.executeSql('DROP TABLE IF EXISTS CLOCK_DATA', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS CLOCK_DATA(id INTEGER PRIMARY KEY AUTOINCREMENT, userID INT(20), longitude REAL(20), latitude REAL(20), startDate VARCHAR(20), startTime VARCHAR(20), startDateTime VARCHAR(30), requestType int(20), workType int(20), shopName VARCHAR(50), location VARCHAR(50), remark VARCHAR(50), image LONGTEXT(255))',
                        []
                    );
                } else {
                    console.log("Clock Table created  - CLOCK TABLE");
                }
            }
        );
    });
})

export const insertClock = ((db, userID, longitude, latitude, startDate, startTime, startDateTime, requestType, workType, shopName, location, remark, image) => {
    console.log(' CLOCK IN INSERT : ', db, userID, longitude, latitude, startDate, startTime, startDateTime, requestType, workType, shopName, location, remark, image)
    db.transaction(function (tx) {
        tx.executeSql(
            'INSERT INTO CLOCK_DATA (userID, longitude, latitude, startDate, startTime, startDateTime, requestType, workType, shopName, location, remark, image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
            [userID, longitude, latitude, startDate, startTime, startDateTime, requestType, workType, shopName, location, remark, image],
            (tx, results) => {
                console.log('Results;;;  ', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    console.log('Clock Data Added Successfully :: ' + date);
                } else {
                    console.log('Failed');
                }
            },
        );
    });
})

export const deleteTableAllClockRequest = ((db) => {
    db.transaction(function (tx) {
        tx.executeSql(
            'DELETE FROM CLOCK_DATA',
            [],
            (tx, results) => {
                console.log('result  :::  ' + results.rowsAffected);
                if (results.rowsAffected > 0) {
                    console.log('Clock Request Data removed Successfully :: ');
                } else {
                    console.log('Failed');
                }
            }
        );
    })
})

export const deleteSingleClockRequest = ((db, id) => {
    db.transaction(function (tx) {
        tx.executeSql(
            'DELETE FROM CLOCK_DATA WHERE id = ' + id,
            [],
            (tx, results) => {
                console.log('result  :::  ' + results.rowsAffected);
                if (results.rowsAffected > 0) {
                    console.log('Clock Request Data removed Successfully :: ' + id);
                } else {
                    console.log('Failed');
                }
            }
        );
    })
})

// Table & quries for Attendance Type
export const createAttendanceTypeTabel = ((db) => {
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='attendance_type'",
            [],
            function (tx, res) {
                console.log('item:', res.rows.length);
                if (res.rows.length == 0) {
                    console.log("already created");
                    txn.executeSql('DROP TABLE IF EXISTS attendance_type', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS attendance_type(id INTEGER PRIMARY KEY AUTOINCREMENT, typeId int(11),typeValue VARCHAR(20))',
                        []
                    );
                } else {
                    console.log("Attendance Type Table created");
                }
            }
        );
    });
})

export const insertAttendanceType = ((db, typeId, typeValue) => {
    console.log(':: :: :: ' + typeValue)
    db.transaction(function (tx) {
        tx.executeSql(
            'INSERT INTO attendance_type (typeId, typeValue) VALUES (?,?)',
            [typeId, typeValue],
            (tx, results) => {
                console.log('Results;;;  ', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    console.log('Attendance Type Added Successfully.');
                } else {
                    console.log('Failed');
                }
            }
        );
    });
})

export const deleteTableAllAttendanceType = ((db) => {
    db.transaction(function (tx) {
        tx.executeSql(
            'DELETE FROM attendance_type',
            [],
            (tx, results) => {
                console.log('result  :::  ' + results.rowsAffected);
                if (results.rowsAffected > 0) {
                    console.log('Attendance Type Data removed Successfully :: ');
                } else {
                    console.log('Failed');
                }
            }
        );
    })
})