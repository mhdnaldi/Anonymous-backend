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
  activeAccount,
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
        return helper.response(res, 400, "THIS EMAIL IS ALREADY TAKEN");
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
        const hashEmail = bcrypt.hashSync(hash, salt);
        const setData = {
          user_name,
          user_email,
          user_phone,
          user_password: hash,
          created_at: new Date(),
        };

        const result = await registerUser(setData);

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
            subject: "ACTIVATE ACCOUNT",
            html: ` <div
            style="
              border: 10px solid #031125;
              border-radius: 10px 10px 32px 32px;
              font-family: arial;
              width: 375px;
              margin: 20px auto;
              display: grid;
              grid-template-columns: 1fr;
              justify-items: center;
            "
          >
            <div style="width: 100%; height: 60px; background-color: #031125">
              <h2
                style="
                  text-align: center;
                  color: #eee;
                  letter-spacing: 1px;
                  padding-top: 0;
                "
              >
                MIXINS
              </h2>
            </div>
            <div
              style="
                background: linear-gradient(45deg, #d236e0 0%, #b6781a 100%);
                text-align: center;
                color: #fff;
                padding: 0 15px;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
              "
            >
              <h3 style="text-align: left">Activate your Account</h3>
              <p style="text-align: left; font-size: 14px">
                Thankyou for registering with us. In order to activate your account please click the button below.
              </p>
              <button
                style="
                  width: 160px;
                  height: 35px;
                  background-color: #031125;
                  border-color: #031125;
                  font-weight: bold;
                  font-size: 14px;
                  color: #fff;
                  border-radius: 10px;
                  box-shadow: 0 15px 14px -3px rgba(0, 0, 0, 0.4);
                "
              >
                <a
                  style="text-decoration: none; color: #fff; font-size: 14px"
                  href="${process.env.URL_ACTIVE}${hashEmail}"
                  >ACTIVATE</a
                >
              </button>
              <p style="text-align: left; font-size: 12px">
                If that doesn't work, copy and paste the following link in your
                browser:
                <a href="" style="color: #a6c2eb">${process.env.URL_ACTIVE}${hashEmail}</a>
              </p>
              <p style="text-align: left; font-size: 14px">
                Cheers,<br />
                Naldi
              </p>
            </div>
            <div
              style="
                width: 100%;
                height: 30px;
                background-color: #031125;
                border-radius: 0 0 20px 20px;
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
          "REGISTER SUCCESS. PLEASE CHECK YOUR EMAIL TO ACTIVATE YOUR ACCOUNT",
          info
        );

        // return helper.response(res, 200, "REGISTER SUCCESS", result);
      }
    } catch (err) {
      console.log(err);
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
  login: async (req, res) => {
    try {
      const { user_email, user_password } = req.body;
      const check = await checkUser(user_email);
      if (check[0].user_role === null) {
        return helper.response(
          res,
          400,
          "THIS ACCOUNT IS NOT ACTIVE PLEASE CHECK YOUR INBOX"
        );
      } else {
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
            //
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
      }
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
  activeAccount: async (req, res) => {
    const { user_email, user_role } = req.body;
    try {
      await activeAccount(user_email, user_role);
      return helper.response(res, 200, "ACCOUNT IS ACTIVE");
    } catch (err) {
      console.log(err);
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
              html: ` <div
              style="
                border: 10px solid #031125;
                border-radius: 10px 10px 32px 32px;
                font-family: arial;
                width: 375px;
                margin: 20px auto;
                display: grid;
                grid-template-columns: 1fr;
                justify-items: center;
              "
            >
              <div style="width: 100%; height: 60px; background-color: #031125">
                <h2
                  style="
                    text-align: center;
                    color: #eee;
                    letter-spacing: 1px;
                    padding-top: 0;
                  "
                >
                  MIXINS
                </h2>
              </div>
              <div
                style="
                  background: linear-gradient(45deg, #d236e0 0%, #b6781a 100%);
                  text-align: center;
                  color: #fff;
                  padding: 0 15px;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                "
              >
                <h3 style="text-align: left">Reset Your Password</h3>
                <p style="text-align: left; font-size: 14px">
                  Tap the button below to reset your account password. If you didn't
                  request a new password, you can safely delete this email.
                </p>
                <button
                  style="
                    width: 160px;
                    height: 35px;
                    background-color: #031125;
                    border-color: #031125;
                    font-weight: bold;
                    font-size: 14px;
                    color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 15px 14px -3px rgba(0, 0, 0, 0.4);
                  "
                >
                  <a
                    style="text-decoration: none; color: #fff; font-size: 14px"
                    href="${process.env.URL}${key}"
                    >CLICK HERE</a
                  >
                </button>
                <p style="text-align: left; font-size: 12px">
                  If that doesn't work, copy and paste the following link in your
                  browser:
                  <a href="" style="color: #a6c2eb">${process.env.URL}${key}</a>
                </p>
                <p style="text-align: left; font-size: 14px">
                  Cheers,<br />
                  Naldi
                </p>
              </div>
              <div
                style="
                  width: 100%;
                  height: 30px;
                  background-color: #031125;
                  border-radius: 0 0 20px 20px;
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
            "EMAIL SENT. PLEASE CHECK YOUR INBOX",
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
