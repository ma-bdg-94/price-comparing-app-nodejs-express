const { model, Schema } = require("mongoose");
const deletePlugin = require("mongoose-delete");
const { userTypes } = require("../utils/constants");
const { genSalt, hash } = require("bcryptjs");

const rounds = parseInt(process.env?.BCRYPTJS_ROUNDS);

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 10,
    },
    userType: {
      type: String,
      required: true,
      enum: userTypes,
    },
    refreshToken: {
      type: String,
    },
    secretNumber: {
      number: {
        type: Number,
        required: true,
      },
      expirationDate: {
        type: Date,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(deletePlugin);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await genSalt(rounds);
    this.password = await hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

const User = model("User", UserSchema);
module.exports = User;
