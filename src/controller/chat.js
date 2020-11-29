const helper = require("../helper/index");
const {
  createRoom,
  sendMessage,
  getRoomId,
  getAllFriends,
  getRoomChat,
} = require("../model/chat");
module.exports = {
  getContact: async (req, res) => {
    const { user_id } = req.body;
    try {
      const result = await getAllFriends(user_id);
      return helper.response(res, 200, "SUCCESS GET DATA", result);
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
  getRoomChat: async (req, res) => {
    const { user_id } = req.body;
    try {
      const result = await getRoomChat(user_id);
      console.log(result);
      return helper.response(res, 200, "SUCCESS GET DATA", result);
    } catch (err) {
      console.log(err);
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
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
  createMsg: async (req, res) => {
    const { user_id, friends_id, text_msg } = req.body;
    try {
      if (text_msg === "" || text_msg === undefined || text_msg === null)
        return helper.response(res, 400, "MESSAGE IS EMPTY");
      const roomId = await getRoomId(user_id, friends_id);
      const setData = {
        user_id,
        friends_id,
        message: text_msg,
        room_id: roomId[0].room_id,
        created_at: new Date(),
      };
      await sendMessage(setData);
      return helper.response(res, 200, "MESSAGE SENT");
    } catch (err) {
      console.log(err);
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
};
