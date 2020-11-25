const router = require("express").Router();
const { createRoom } = require("../controller/chat");

router.post("/create-room", createRoom);

module.exports = router;
