const router = require("express").Router();
const {
  getAllUser,
  getUserById,
  patchUserById,
  editPassword,
} = require("../controller/users");
const { authorization } = require("../middleware/auth");

router.get("/", getAllUser);
router.get("/:id", getUserById);
router.patch("/edit-user/:id", patchUserById);
router.patch("/edit-password/:id", editPassword);

module.exports = router;
