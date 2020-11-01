const helper = require("../helper/index");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

let upload = multer({
  storage,
  limits: {
    fileSize: 1000000,
  },
}).single("user_image");

const uploadFilter = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return helper.response(res, 400, err.message);
    } else if (err) {
      return helper.response(res, 400, err.message);
    }
    next();
  });
};

module.exports = uploadFilter;
