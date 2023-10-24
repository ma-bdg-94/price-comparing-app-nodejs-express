const express = require("express");
const router = express.Router();

const { userValidation } = require("../middlewares/validations");
const { validateRegister, validateLogin } = userValidation;

const { userController } = require("../controllers");
const authorize = require("../middlewares/authentications/authorization");
const {
  registerUser,
  smsAuthenticateUser,
  loginUser,
  getAuthenticatedUser,
  refreshAccessToken,
} = userController;

router.post("/auth/register", validateRegister, registerUser);
router.post("/auth/verifySMS", smsAuthenticateUser);
router.post("/auth/refresh", authorize(), refreshAccessToken);
router.post("/auth", validateLogin, loginUser);

router.get("/auth", authorize(), getAuthenticatedUser);

module.exports = router;
