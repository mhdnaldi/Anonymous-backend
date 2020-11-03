const router = require("express").Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  activeAccount,
} = require("../controller/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.patch("/activate-account", activeAccount);
module.exports = router;
