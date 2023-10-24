const { validationResult } = require("express-validator");
const status = require("http-status");
const twilio = require("twilio");
const { User } = require("../models");
const {
  signToken,
  verifyToken,
} = require("../middlewares/authentications/tokens");
const { compare } = require("bcryptjs");

class UserController {
  async registerUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        status: status[status.BAD_REQUEST],
        errors: errors.array({ onlyFirstError: true }).map((e) => e.msg),
        data: null,
      });
    }

    const { fullName, userType, email, phone, password } = req.body;
    const number = Math.floor(Math.random() * 100000);
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    const twilioClient = twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH
    );
    const twilioPhoneNumber = process.env.TWILIO_PHONE;

    try {
      let user = await User.findOne({ $or: [{ email }, { phone }] });
      if (user) {
        return res.status(status.CONFLICT).json({
          success: false,
          status: status[status.CONFLICT],
          errors: ["User already existing in database!"],
          data: null,
        });
      }

      user = new User({
        fullName,
        userType,
        email,
        phone,
        password,
        secretNumber: { number, expirationDate },
      });

      await user.save();

      const message = `Your secret number is ${number}. Your email is ${email}`;
      twilioClient.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: user.phone,
      });

      res.status(status.CREATED).json({
        success: true,
        status: status[status.CREATED],
        errors: [],
        data: { secretNumber: { number, expirationDate }, email },
      });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: status[status.INTERNAL_SERVER_ERROR],
        errors: [error.message],
        data: null,
      });
    }
  }

  async smsAuthenticateUser(req, res) {
    const email = req.query.email;
    const { secretNumber } = req.body;

    try {
      let user = await User.findOne({ email: req.query.email });
      if (
        !user ||
        !user.secretNumber ||
        user.secretNumber.number !== secretNumber
      ) {
        return res.status(status.UNAUTHORIZED).json({
          success: false,
          status: status[status.UNAUTHORIZED],
          errors: ["Secret number is not valid!"],
          data: null,
        });
      }

      if (new Date() > user?.secretNumber?.expiresAt) {
        return res.status(status.UNAUTHORIZED).json({
          success: false,
          status: status[status.UNAUTHORIZED],
          errors: ["Secret number has expired!"],
          data: null,
        });
      }

      const payloadForAccessToken = {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          userType: user.userType,
        },
      };

      const payloadForRefreshToken = {
        user: {
          id: user._id,
        },
      };

      const accessToken = await signToken(
        payloadForAccessToken,
        process.env.JWT_SECRET_ACCESS,
        "1h",
        "24h"
      );
      const refreshToken = await signToken(
        payloadForRefreshToken,
        process.env.JWT_SECRET_REFRESH,
        "7d",
        "30d"
      );

      user = await User.findOneAndUpdate(
        { email },
        { refreshToken, $unset: { secretNumber: 1 } },
        { new: true }
      );

      res.status(status.OK).json({
        success: true,
        status: status[status.OK],
        errors: [],
        data: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: status[status.INTERNAL_SERVER_ERROR],
        errors: [error.message],
        data: null,
      });
    }
  }

  async loginUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        status: status[status.BAD_REQUEST],
        errors: errors.array({ onlyFirstError: true }).map((e) => e.msg),
        data: null,
      });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          status: status[status.NOT_FOUND],
          errors: ["Cannot find any user with those credentials!"],
          data: null,
        });
      }

      const passwordsMatch = await compare(password, user.password);
      if (!passwordsMatch) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          status: status[status.NOT_FOUND],
          errors: ["Cannot find any user with those credentials!"],
          data: null,
        });
      }

      const payloadForAccessToken = {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          userType: user.userType,
        },
      };

      const payloadForRefreshToken = {
        user: {
          id: user._id,
        },
      };

      const accessToken = await signToken(
        payloadForAccessToken,
        process.env.JWT_SECRET_ACCESS,
        "1h",
        "24h"
      );
      const refreshToken = await signToken(
        payloadForRefreshToken,
        process.env.JWT_SECRET_REFRESH,
        "7d",
        "30d"
      );

      user = await User.findOneAndUpdate(
        { email },
        { refreshToken },
        { new: true }
      );

      res.status(status.OK).json({
        success: true,
        status: status[status.OK],
        errors: [],
        data: { accessToken, refreshToken },
      });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: status[status.INTERNAL_SERVER_ERROR],
        errors: [error.message],
        data: null,
      });
    }
  }

  async getAuthenticatedUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id });
      if (!user) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          status: status[status.NOT_FOUND],
          errors: ["Token not found or it is not valid!"],
          data: null,
        });
      }

      res.status(status.OK).json({
        success: false,
        status: status[status.OK],
        errors: [],
        data: { user },
      });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: status[status.INTERNAL_SERVER_ERROR],
        errors: [error.message],
        data: null,
      });
    }
  }

  async refreshAccessToken(req, res) {
    const { refreshTokenFromClient } = req.body;

    try {
      const decodedToken = verifyToken(
        refreshTokenFromClient,
        process.env.JWT_SECRET_REFRESH
      );
      if (!decodedToken.user.id) {
        res.status(status.BAD_REQUEST).json({
          success: false,
          status: status[status.BAD_REQUEST],
          errors: ["Token payload is not valid!"],
          data: null,
        });
      }

      let user = await User.findOne({ _id: decodedToken?.user?.id });
      if (!user) {
        res.status(status.NOT_FOUND).json({
          success: false,
          status: status[status.NOT_FOUND],
          errors: ["Cannot find any user with those credentials!"],
          data: null,
        });
      }

      const payloadForAccessToken = {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          userType: user.userType,
        },
      };

      const payloadForRefreshToken = {
        user: {
          id: user._id,
        },
      };

      const accessToken = await signToken(
        payloadForAccessToken,
        process.env.JWT_SECRET_ACCESS,
        "1h",
        "24h"
      );

      const refreshToken = await signToken(
        payloadForRefreshToken,
        process.env.JWT_SECRET_REFRESH,
        "7d",
        "30d"
      );

      user = await User.findOneAndUpdate(
        { _id: decodedToken?.user?.id },
        { refreshToken },
        { new: true }
      );

      res.status(status.OK).json({
        success: true,
        status: status[status.OK],
        errors: [],
        data: { accessToken, refreshToken },
      });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: status[status.INTERNAL_SERVER_ERROR],
        errors: [error.message],
        data: null,
      });
    }
  }
}

module.exports = UserController;
