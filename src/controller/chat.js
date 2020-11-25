const helper = require("../helper/index");
const { createRoom } = require("../model/chat");
module.exports = {
  createRoom: async (req, res) => {
    let generateRoom = 10000 + Math.floor(Math.random() * 100000);
    const { user_id, friends_id } = req.body;
    try {
      const setDataOne = {
        user_id,
        friends_id,
        room_id: generateRoom,
        created_at: new Date(),
      };
      const setDataTwo = {
        user_id: friends_id,
        friends_id: user_id,
        room_id: generateRoom,
        created_at: new Date(),
      };
      await createRoom(setDataOne);
      await createRoom(setDataTwo);
      return helper.response(res, 200, "ROOM CREATED");
    } catch (err) {
      console.log(err);
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
};
