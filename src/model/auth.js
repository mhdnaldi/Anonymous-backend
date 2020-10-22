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
};
