const UserController = require("./user.controller");
const ScreenController = require("./link.controller");

const userController = new UserController();
const screenController = new ScreenController();

module.exports = {
  screenController,
  userController,
};
