const connection = require("../config/mysql");

module.exports = {
  createRoom: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO rooms SET ?", setData, (err, data) => {
        !err ? resolve(data) : reject(new Error(err));
      });
    });
  },
  sendMessage: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO messages SET ?`, setData, (err, data) => {
        !err ? resolve(data) : reject(new Error(err));
      });
    });
  },
  getRoomId: (id, friends_id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM rooms JOIN users ON rooms.friends_id = users.user_id WHERE rooms.user_id = ${id} AND rooms.friends_id = ${friends_id}`,
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
};
