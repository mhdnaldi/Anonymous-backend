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
  checkUser: (data) => {
    const mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let query = "";
    if (!data.match(mailFormat)) {
      query = `user_name`;
    } else {
      query = `user_email`;
    }
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT user_id, user_name, user_email, user_phone, user_status, user_image, user_password, user_role FROM users WHERE ${query} = ?`,
        data,
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
  activeAccount: (email, role) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET user_role = ${role} WHERE user_email = "${email}"`,
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
};
