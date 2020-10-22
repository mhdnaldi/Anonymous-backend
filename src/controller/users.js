const helper = require("../helper/index");
const { getAllUser, getUserById } = require("../model/users");

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
};
