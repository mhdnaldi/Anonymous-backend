const router = require("express").Router();

const auth = require("./routes/auth");
const users = require("./routes/users");
const chat = require("./routes/chat");

router.use("/auth", auth);
router.use("/users", users);
router.use("/chat", chat);

module.exports = router;
