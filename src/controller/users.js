const helper = require("../helper/index");
const { getAllUser } = require("../model/users");

module.exports = {
  getAllUser: async (req, res) => {
    try {
      const result = await getAllUser();
      return helper.response(res, 200, "SUCCESS GET ALL USER", result);
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
};
