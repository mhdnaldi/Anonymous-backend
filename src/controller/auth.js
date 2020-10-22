const helper = require("../helper/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { registerUser } = require("../model/auth");
const { getAllUser } = require("../model/users");

module.exports = {
  register: async (req, res) => {
    try {
      const {
        user_name,
        user_email,
        user_phone,
        user_password,
        confirm_password,
      } = req.body;

      const mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      const passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

      let checkEmail = await getAllUser();
      checkEmail = checkEmail.map((value) => {
        return value.user_email;
      });

      if (checkEmail.includes(user_email)) {
        return helper.response(res, 400, "THIS EMAIL IS ALREADY REGISTERED");
      } else if (user_name === undefined || user_name === "") {
        return helper.response(res, 400, "PLEASE ENTER YOUR NAME");
      } else if (user_email === undefined || user_email === "") {
        return helper.response(res, 400, "PLEASE ENTER YOUR EMAIL");
      } else if (!user_email.match(mailFormat)) {
        return helper.response(res, 400, "EMAIL IS WRONG");
      } else if (!user_password.match(passwordFormat)) {
        return helper.response(
          res,
          400,
          "PASSWORD MUST INCLUDES AT LEAST ONE UPPERCASE, LOWERCASE, NUMERIC DIGIT AND MINIMUM 8 CHARACTERS"
        );
      } else if (confirm_password != user_password) {
        return helper.response(res, 400, "PASSWORD DIDN'T MATCH");
      } else if (user_phone === "" || user_phone === undefined) {
        return helper.response(res, 400, "PHONE NUMBER CANNOT BE EMPTY");
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user_password, salt);

        const setData = {
          user_name,
          user_email,
          user_phone,
          user_password: hash,
          created_at: new Date(),
        };

        const result = await registerUser(setData);
        return helper.response(res, 200, "REGISTER SUCCESS", result);
      }
    } catch (err) {
      console.log(err);
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
};
