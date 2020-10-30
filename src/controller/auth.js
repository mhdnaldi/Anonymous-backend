const helper = require("../helper/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const {
  registerUser,
  checkUser,
  patchKey,
  checkKey,
  resetPassword,
} = require("../model/auth");
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
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
  login: async (req, res) => {
    try {
      const { user_email, user_password } = req.body;
      const check = await checkUser(user_email);
      if (check.length > 0) {
        const checkPassword = bcrypt.compareSync(
          user_password,
          check[0].user_password
        );
        if (checkPassword) {
          // JWT PROCESS
          const {
            user_id,
            user_name,
            user_email,
            user_phone,
            user_status,
            user_image,
            user_role,
          } = check[0];

          let payload = {
            user_id,
            user_name,
            user_email,
            user_phone,
            user_status,
            user_image,
            user_role,
          };

          const token = jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: "24h",
          });

          payload = { ...payload, token };
          return helper.response(res, 200, "LOGIN SUCCESS", payload);
        } else {
          return helper.response(res, 400, "WRONG PASSWORD");
        }
      } else {
        return helper.response(
          res,
          400,
          "EMAIL IS NOT REGISTERED PLEASE SIGN UP FIRST"
        );
      }
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
  forgotPassword: async (req, res) => {
    const { user_email } = req.body;
    let key = Math.floor(100000 + Math.random() * 900000);
    try {
      if (user_email === undefined || user_email === "") {
        return helper.response(res, 400, "PLEASE ENTER YOUR EMAIL");
      } else {
        const checkEmail = await checkUser(user_email);
        if (checkEmail < 1) {
          return helper.response(res, 400, "THIS EMAIL IS NOT REGISTERED");
        } else {
          await patchKey(key, user_email);
          const transporter = nodemailer.createTransport({
            // host: "smtp.gmail.com",
            // port: 465,
            // secure: true,
            service: "gmail",
            auth: {
              user: process.env.GMAIL,
              pass: process.env.GMAIL_PASSWORD,
            },
          });
          const info = await transporter.sendMail(
            {
              from: '"ANONYMOUS"',
              to: user_email,
              subject: "FORGOT PASSWORD",
              html: `<div
              style="
                border-radius: 20px;
                font-family: arial;
                width: 300px;
                margin: 20px auto;
                display: grid;
                grid-template-columns: 1fr;
                justify-items: center;
                background-color: rgb(212, 212, 212);
              "
            >
              <div style="text-align: center; color: #222; padding: 0 10px">
                <h2>Key to Reset Your Password</h2>
                <h4>THE FOLLOWING BUTTON IS FOR YOU TO RESET YOUR PASSWORD</h4>
                <button
                  style="
                    width: 160px;
                    height: 40px;
                    background-color: #5d9dff;
                    border-color: #5d9dff;
                    font-weight: bold;
                    font-size: 14px;
                    color: #111;
                    border-radius: 10px;
                  "
                >
                <a style="text-decoration: none; color: #222"
                href="${process.env.URL}${key}">CLICK HERE</a>
              
                </button>
              </div>
              <div
                style="
                  width: 100%;
                  height: 30px;
                  background-color: #111;
                  border-radius: 0 0 20px 20px;
                  margin-top: 20px;
                "
              ></div>
            </div>`,
            },
            function (err) {
              if (err) {
                return helper.response(res, 400, "Failed to send email");
              }
            }
          );
          return helper.response(
            res,
            200,
            "Email sent. Please check your inbox",
            info
          );
        }
      }
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
  resetPassword: async (req, res) => {
    let { user_key, user_password, confirm_password } = req.body;
    const passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    try {
      let check = await checkKey(parseInt(user_key));

      if (check.length === 0) {
        return helper.response(res, 400, "WRONG KEY!");
      } else if (user_password === undefined && user_password === "") {
        return helper.response(res, 400, "PLEASE ENTER YOUR NEW PASSWORD");
      } else {
        if (!user_password.match(passwordFormat)) {
          return helper.response(
            res,
            400,
            "PASSWORD MUST INCLUDES AT LEAST ONE UPPERCASE, LOWERCASE, NUMERIC DIGIT AND MINIMUM 8 CHARACTERS"
          );
        } else if (confirm_password !== user_password) {
          return helper.response(res, 400, `PASSWORD DIDN'T MATCH`);
        } else {
          const email = check[0].user_email;
          let salt = bcrypt.genSaltSync(10);
          let hash = bcrypt.hashSync(user_password, salt);
          user_password = hash;
          await resetPassword(user_password, user_key);
          await patchKey(null, email);
          return helper.response(res, 200, "YOUR PASSWORD HAS BEEN CHANGED");
        }
      }
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
};
