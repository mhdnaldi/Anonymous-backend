const router = require("express").Router();
const { getAllUser, getUserById } = require("../controller/users");
const { authorization } = require("../middleware/auth");

router.get("/", authorization, getAllUser);
router.get("/:id", getUserById);

module.exports = router;
