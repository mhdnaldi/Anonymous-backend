const connection = require("../config/mysql");

module.exports = {
  getAllUser: () => {
    return new Promise((resolve, reject) => [
      connection.query(
        "SELECT user_id, user_name, user_email, user_image, user_role, user_status FROM users",
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      ),
    ]);
  },
  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT user_id, user_name, user_email, user_image, user_role, user_phone, user_status FROM users WHERE user_id = ?",
        id,
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  patchUser: (id, setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET user_name = "${setData.user_name}", user_phone = "${setData.user_phone}", user_status = "${setData.user_status}" WHERE user_id = ${id}`,
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  patchPassword: (id, password) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET user_password = "${password}" WHERE user_id = ${id}`,
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  patchImage: (id, img) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET user_image = "${img}" WHERE user_id = ${id}`,
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
};
