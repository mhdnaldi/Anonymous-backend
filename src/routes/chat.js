const router = require("express").Router();
const { createRoom, createMsg, getContact } = require("../controller/chat");

router.get("/contact", getContact);
router.post("/create-room", createRoom);
router.post("/create-message", createMsg);

module.exports = router;
