const router = require("express").Router();
const {
  getAllUser,
  getUserById,
  patchUserById,
  editPassword,
  editImage,
  deleteImg,
} = require("../controller/users");
const uploadImage = require("../middleware/multer");
const { authorization } = require("../middleware/auth");

router.get("/", getAllUser);
router.get("/:id", getUserById);
router.patch("/edit-user/:id", patchUserById);
router.patch("/edit-password/:id", editPassword);
router.patch("/edit-img/:id", uploadImage, editImage);
router.patch("/delete-img/:id", uploadImage, deleteImg);

module.exports = router;
