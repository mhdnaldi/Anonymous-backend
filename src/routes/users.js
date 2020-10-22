const router = require("express").Router();
const { getAllUser } = require("../controller/users");

router.get("/", getAllUser);

module.exports = router;
