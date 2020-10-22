const router = require("express").Router();

const auth = require("./routes/auth");
const users = require("./routes/users");

router.use("/auth", auth);
router.use("/users", users);

module.exports = router;
