const router = require("express").Router();
const {
  createRoom,
  createMsg,
  getContact,
  getRoomChat,
} = require("../controller/chat");

router.get("/contact", getContact);
router.get("/room-chat", getRoomChat);
router.post("/create-room", createRoom);
router.post("/create-message", createMsg);

module.exports = router;
