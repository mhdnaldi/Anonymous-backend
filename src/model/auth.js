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
  loginUser: (email) => {
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
};
