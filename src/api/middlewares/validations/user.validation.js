const { body } = require("express-validator");
const { userTypes } = require("../../utils/constants");

class UserValidation {
  validateRegister = [
    body("fullName").not().isEmpty().withMessage("Full name is missing!"),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email address is missing!")
      .isEmail()
      .withMessage("Wrong email format!"),
    body("phone")
      .not()
      .isEmpty()
      .withMessage("Phone number is missing!")
      .isMobilePhone("ar-TN")
      .withMessage("Wrong number format!"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password is missing!")
      .isLength({ min: 10 })
      .withMessage("Password must contain at least 10 characters!")
      .matches(/^(?=.*\d)(?=.*\W).+$/)
      .withMessage("Password must contain at least one number and one symbol!"),
    body("userType")
      .not()
      .isEmpty()
      .withMessage("User type is missing!")
      .isIn(userTypes)
      .withMessage("Invalid user type!"),
  ];

  validateLogin = [
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email address is missing!")
      .isEmail()
      .withMessage("Wrong email format!"),
    body("password").not().isEmpty().withMessage("Password is missing!"),
  ];
}

module.exports = UserValidation;
