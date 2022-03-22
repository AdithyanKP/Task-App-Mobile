import SQLite from 'react-native-sqlite-storage';
import get from 'lodash.get';
let db = null;
export const initDB = async () => {
  const dbConn = await SQLite.openDatabase(
    {
      name: 'TaskDB',
      location: 'default',
    },
    () => {
      console.log('database connection successfully');
    },
    error => {
      console.log(error);
    },
  );
  if (dbConn) {
    await dbConn.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS' +
          ' active_tasks' +
          ' (id integer primary key  AUTOINCREMENT, task varchar(50))',
        [],
        () => {
          console.log('active user table created successfully');
        },
        err => {
          console.log('active user table created successfully', err);
        },
      );
    });
    return dbConn;
  }
};
export const findOne = async (tableName, where = null) => {
  if (!get(db, 'transaction', false)) {
    db = await initDB();
  }
  let whereCondi = '';
  if (!tableName) reject('Table name missing');

  if (where) {
    whereCondi = `WHERE ${where}`;
  }
  return new Promise((resolve, reject) => {
    if (!tableName) reject('Table name missing');
    try {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM ${tableName} ${whereCondi} ORDER BY id DESC`,
          [],
          (tx, results) => {
            const len = results.rows.length;
            if (len > 0) {
              resolve(results.rows.item(0));
            } else {
              resolve(null);
            }
          },
        );
      });
    } catch (err) {
      console.log('>>', err);
      reject(err);
    }
  });
};
export const Insert = async (tableName, userFields, data) => {
  if (!get(db, 'transaction', false)) {
    db = await initDB();
  }

  return new Promise((resolve, reject) => {
    if (!tableName) reject('Table name missing');
    if (!data) reject('Data is missing');
    let questionMarks = '';
    data.map((row, idx) => {
      if (idx == data.length - 1) {
        questionMarks += '?';
      } else {
        questionMarks += '?,';
      }
    });

    try {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO ${tableName} ${userFields} VALUES (${questionMarks})`,
          data,
          (tx, results) => {
            console.log('Database Insertion successfully', tableName);
            resolve(results);
          },
          err => {
            console.warn('database Insertion failed', err);
            reject(err);
          },
        );
      });
    } catch (err) {
      reject(err);
    }
  });
};
export const findMany = async (tableName, where = null) => {
  if (!get(db, 'transaction', false)) {
    db = await initDB();
  }
  return new Promise((resolve, reject) => {
    let whereCondi = '';
    if (!tableName) reject('Table name missing');
    if (where) {
      whereCondi = `where ${where}`;
    }
    try {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM ${tableName} ${whereCondi}`,
          [],
          (tx, results) => {
            const len = results.rows.length;
            if (len > 0) {
              resolve(results.rows.raw());
            } else {
              resolve(null);
            }
          },
          err => {
            reject(err);
          },
        );
      });
    } catch (err) {
      console.warn(err);
      reject(err);
    }
  });
};
export const Delete = async (tableName, where = null) => {
  if (!get(db, 'transaction', false)) {
    db = await initDB();
  }
  return new Promise((resolve, reject) => {
    let whereCondi = '';
    if (!tableName) reject('Table name missing');
    if (where) {
      whereCondi = `where ${where}`;
    }
    try {
      db.transaction(tx => {
        tx.executeSql(
          `DELETE FROM ${tableName} ${whereCondi}`,
          [],
          (tx, results) => {
            resolve(true);
            console.warn(results);
          },
          err => {
            console.warn('error on deletion', err);
            reject(err);
          },
        );
      });
    } catch (err) {
      console.warn(err);
      reject(err);
    }
  });
};
export const UserInsertMany = async (tableName, userFields, data) => {
  if (!get(db, 'transaction', false)) {
    db = await initDB();
  }

  return new Promise((resolve, reject) => {
    if (!tableName) reject('Table name missing');
    if (!data) reject('Data is missing');
    if (data.length == 0) reject('data is empty');
    let questionMarks = '';
    const uniqueIds = [];

    const uniqueData = data.filter(element => {
      const isDuplicate = uniqueIds.includes(element.id);

      if (!isDuplicate) {
        uniqueIds.push(element.id);

        return true;
      }
    });
    try {
      db.transaction(tx => {
        let query = `INSERT INTO ${tableName} ${userFields} VALUES`;
        for (let i = 0; i < uniqueData.length; ++i) {
          query =
            query +
            "('" +
            parseInt(uniqueData[i].id) +
            "','" +
            uniqueData[i].task +
            "')";
          if (i != uniqueData.length - 1) {
            query = query + ',';
          }
        }
        query = query + ';';

        tx.executeSql(
          query,
          [],
          (tx, results) => {
            console.log('Many Database Insertion successfully', tableName);
            resolve(results);
          },
          err => {
            console.warn('Many database Insertion failed', err);
            reject(err);
          },
        );
      });
    } catch (err) {
      reject(err);
    }
  });
};
