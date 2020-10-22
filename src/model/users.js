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
};
