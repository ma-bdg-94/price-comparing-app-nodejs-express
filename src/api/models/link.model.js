const { model, Schema } = require("mongoose");
const deletePlugin = require("mongoose-delete");
const { groceryTypes } = require("../utils/constants");

const ScreenSchema = new Schema(
  {
    title: {
      ar: {
        type: String,
        required: true,
      },
      fr: {
        type: String,
        required: true,
      },
      en: {
        type: String,
        required: true,
      },
    },
    category: {
      type: String,
      required: true,
      enum: groceryTypes,
    },
    icon: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ScreenSchema.plugin(deletePlugin);

const Screen = model("Screen", ScreenSchema);
module.exports = Screen;
