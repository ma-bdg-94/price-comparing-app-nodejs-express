const UserValidation = require("./user.validation");
const ScreenValidation = require("./link.validation");

const userValidation = new UserValidation();
const screenValidation = new ScreenValidation();

module.exports = {
  screenValidation,
  userValidation,
};
