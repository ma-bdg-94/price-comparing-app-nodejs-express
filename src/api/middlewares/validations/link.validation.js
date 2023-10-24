const { body } = require("express-validator");
const { groceryTypes } = require("../../utils/constants");

class ScreenValidation {
  validateScreen = [
    body("titleEn")
      .not()
      .isEmpty()
      .withMessage("Screen title in English is required!"),
    body("titleFr")
      .not()
      .isEmpty()
      .withMessage("Screen title in French is required!"),
    body("titleAr")
      .not()
      .isEmpty()
      .withMessage("Screen title in Arabic is required!"),
    body("icon")
      .not()
      .isEmpty()
      .withMessage("Screen icon is Missing!")
      .isURL()
      .withMessage("Wrong format!"),
    body("to")
      .not()
      .isEmpty()
      .withMessage("Screen link is Missing!"),
    body("category")
      .not()
      .isEmpty()
      .withMessage("Link category is missing!")
      .isIn(groceryTypes)
      .withMessage("Invalid link category!"),
  ];
}

module.exports = ScreenValidation;
