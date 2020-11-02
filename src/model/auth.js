const connection = require("../config/mysql");

module.exports = {
  registerUser: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO users SET ?`, setData, (err, data) => {
        if (!err) {
          const newResult = {
            user_id: data.insertId,
            ...setData,
          };
          resolve(newResult);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  checkUser: (email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT user_id, user_name, user_email, user_phone, user_status, user_image, user_password, user_role FROM users WHERE user_email = ?`,
        email,
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  patchKey: (key, email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET user_key = ? WHERE user_email = ?`,
        [key, email],
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  checkKey: (key) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT user_email from users WHERE user_key = ?",
        key,
        (err, data) => {
          !err ? resolve(data) : reject(err);
        }
      );
    });
  },
  resetPassword: (password, key) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE users SET user_password = ? WHERE user_key = ?",
        [password, key],
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  activeAccount: (id, role) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET user_role = ${role} WHERE user_id = ${id}`,
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
};
