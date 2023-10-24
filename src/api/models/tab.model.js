const { model, Schema } = require("mongoose");
const deletePlugin = require("mongoose-delete");

const TabSchema = new Schema(
  {
    link: {
      type: Schema.Types.ObjectId,
      ref: "Link",
    },
    name: {
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
    icon: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

TabSchema.plugin(deletePlugin);

const Tab = model("Tab", TabSchema);
module.exports = Tab;
