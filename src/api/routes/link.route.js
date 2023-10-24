const express = require("express");
const router = express.Router();

const { screenValidation } = require("../middlewares/validations");
const { validateScreen } = screenValidation;

const { screenController } = require("../controllers");
const authorize = require("../middlewares/authentications/authorization");
const { ADMIN } = require("../utils/constants");
const { addScreen, getScreenList, getScreenListByCategory, getSingleScreen } =
  screenController;

router.post("/", [authorize([ADMIN]), validateScreen], addScreen);

router.get("/list", getScreenList);
router.get("/list/:category", getScreenListByCategory);
router.get("/single/:id", getSingleScreen);

module.exports = router;
