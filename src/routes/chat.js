const router = require("express").Router();
const { createRoom, createMsg } = require("../controller/chat");

router.post("/create-room", createRoom);
router.post("/create-message", createMsg);

module.exports = router;
