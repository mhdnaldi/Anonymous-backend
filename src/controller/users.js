const helper = require("../helper/index");
const {
  getAllUser,
  getUserById,
  patchUser,
  patchPassword,
  patchImage,
  getFriends,
  addFriends,
  checkFriends,
} = require("../model/users");
const bcrypt = require("bcrypt");
const fs = require("fs");

module.exports = {
  getAllUser: async (req, res) => {
    try {
      const result = await getAllUser();
      return helper.response(res, 200, "SUCCESS GET ALL USER", result);
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await getUserById(id);
      return helper.response(
        res,
        200,
        `SUCCESS GET USER WITH ID: ${id}`,
        result
      );
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
  patchUserById: async (req, res) => {
    const { id } = req.params;
    let { user_full_name, user_phone, user_status } = req.body;
    try {
      const getUser = await getUserById(id);
      console.log(getUser[0]);
      let setData = {
        user_full_name,
        user_phone,
        user_status,
      };
      if (user_full_name === undefined || user_full_name === "") {
        setData.user_full_name = getUser[0].user_full_name;
      }
      if (user_phone === undefined || user_phone === "") {
        setData.user_phone = getUser[0].user_phone;
      }
      if (user_status === undefined || user_status === "") {
        setData.user_status = getUser[0].user_status;
      }
      await patchUser(id, setData);
      return helper.response(res, 200, "PROFILE UPDATED");
    } catch (err) {
      console.log(err);
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
  editPassword: async (req, res) => {
    const { id } = req.params;
    const { user_password, confirm_password } = req.body;
    const passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    try {
      if (user_password === "" || user_password === undefined) {
        return helper.response(res, 400, "PASSWORD CANNOT BE EMPTY");
      } else if (!user_password.match(passwordFormat)) {
        return helper.response(
          res,
          400,
          "PASSWORD MUST INCLUDES AT LEAST ONE UPPERCASE, LOWERCASE, NUMERIC DIGIT AND MINIMUM 8 CHARACTERS"
        );
      } else if (user_password !== confirm_password) {
        return helper.response(res, 400, "PASSWORD DIDN'T MATCH");
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user_password, salt);
        await patchPassword(id, hash);
        return helper.response(res, 200, "PASSWORD HAS BEEN CHANGED");
      }
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
  editImage: async (req, res) => {
    try {
      const { id } = req.params;
      const getImage = await getUserById(id);
      const img = getImage[0].user_image;
      if (img === "default.png") {
        let user_image = req.file === undefined ? img : req.file.filename;
        await patchImage(id, user_image);
        return helper.response(res, 200, "IMAGE HAS BEEN CHANGE");
      } else {
        fs.unlink(`uploads/${img}`, (err) => {
          !err ? console.log("ok") : console.log(err);
        });
        let user_image = req.file === undefined ? img : req.file.filename;
        await patchImage(id, user_image);
        return helper.response(res, 200, "IMAGE HAS BEEN CHANGE");
      }
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
  deleteImg: async (req, res) => {
    const { id } = req.params;
    const getImage = await getUserById(id);
    const img = getImage[0].user_image;
    if (img === "default.img") {
      return helper.response(res, 200, "IMAGE DELETED");
    } else {
      fs.unlink(`uploads/${img}`, (err) => {
        !err ? console.log("OK") : console.log(err);
      });
      let user_image = "default.png";
      await patchImage(id, user_image);
      return helper.response(res, 200, "IMAGE DELETED");
    }
  },
  addFriends: async (req, res) => {
    const { id, friends } = req.query;
    try {
      let myAccount = await getUserById(id);
      let myName = myAccount[0].user_name;
      let myEmail = myAccount[0].user_email;
      if (friends === myName || friends === myEmail) {
        return helper.response(res, 400, "YOU CAN'T ADD YOURSELF");
      }
      const check = await getFriends(friends);
      let friends_id = check[0].user_id;
      const exists = await checkFriends(id, friends_id);
      if (exists.length > 0)
        return helper.response(res, 400, "FRIENDS ALREADY EXISTS");
      const setData = {
        user_id: id,
        friends_id,
        created_at: new Date(),
      };

      await addFriends(setData);
      return helper.response(res, 200, "SUCCESS ADD FRIENDS");
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
};
