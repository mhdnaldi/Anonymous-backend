const connection = require("../config/mysql");

module.exports = {
  createRoom: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO rooms SET ?", setData, (err, data) => {
        !err ? resolve(data) : reject(new Error(err));
      });
    });
  },
};
