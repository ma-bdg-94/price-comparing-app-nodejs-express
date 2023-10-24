const { validationResult } = require("express-validator");
const status = require("http-status");
const { Screen } = require("../models");
const { groceryTypes } = require("../utils/constants");

class ScreenController {
  async addScreen(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        status: status[status.BAD_REQUEST],
        errors: errors.array({ onlyFirstError: true }).map((e) => e.msg),
        data: null,
      });
    }

    const { titleEn, titleFr, titleAr, icon, category, to } = req.body;

    try {
      let screen = await Screen.findOne({
        $or: [{ icon }, { to }],
        deleted: false,
      });
      if (screen) {
        return res.status(status.CONFLICT).json({
          success: false,
          status: status[status.CONFLICT],
          errors: ["This link already existing in database!"],
          data: null,
        });
      }

      screen = new Screen({
        category,
        icon,
        to,
        title: { en: titleEn, fr: titleFr, ar: titleAr },
      });

      await screen.save();

      res.status(status.CREATED).json({
        success: true,
        status: status[status.CREATED],
        errors: [],
        data: { screen },
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

  async getScreenList(req, res) {
    try {
      const screenList = await Screen.find({ deleted: false }).sort({
        createdAt: 1,
      });
      if (screenList.length < 1) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          status: status[status.NOT_FOUND],
          errors: ["Cannot find any screens in the database!"],
          data: null,
        });
      }

      res.status(status.OK).json({
        success: true,
        status: status[status.OK],
        errors: [],
        data: { screenList },
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

  async getScreenListByCategory(req, res) {
    try {
      const screenList = await Screen.find({
        deleted: false,
        category: req.params.category,
      }).sort({ createdAt: 1 });
      if (screenList.length < 1) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          status: status[status.NOT_FOUND],
          errors: ["Cannot find any screens with this criteria!"],
          data: null,
        });
      }

      if (!groceryTypes.includes(req.params.category)) {
        return res.status(status.UNAUTHORIZED).json({
          success: false,
          status: status[status.UNAUTHORIZED],
          errors: ["Selected category is not permitted!"],
          data: null,
        });
      }

      res.status(status.OK).json({
        success: true,
        status: status[status.OK],
        errors: [],
        data: { screenList },
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

  async getSingleScreen(req, res) {
    try {
      const screen = await Screen.findOne({
        deleted: false,
        _id: req.params.id,
      });
      if (!screen) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          status: status[status.NOT_FOUND],
          errors: ["Cannot find any screens with this criteria!"],
          data: null,
        });
      }

      res.status(status.OK).json({
        success: true,
        status: status[status.OK],
        errors: [],
        data: { screen },
      });
    } catch (error) {
      if (error.kind == "ObjectId") {
        return res.status(status.NOT_FOUND).json({
          success: false,
          status: status[status.NOT_FOUND],
          errors: ["Cannot find any screens with this criteria!"],
          data: null,
        });
      }
      res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: status[status.INTERNAL_SERVER_ERROR],
        errors: [error.message],
        data: null,
      });
    }
  }
}

module.exports = ScreenController;
