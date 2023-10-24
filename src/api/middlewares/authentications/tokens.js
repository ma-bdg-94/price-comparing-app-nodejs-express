const { sign, verify } = require("jsonwebtoken");

const signToken = (payload, secret, durationDev, durationProd) => {
  return new Promise((resolve, reject) => {
    sign(
      payload,
      secret,
      { expiresIn: process.env.NODE_ENV === "development" ? durationDev : durationProd },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
};

const verifyToken = (payload, secret) => {
  return verify(payload, secret)
}

module.exports = { signToken, verifyToken };
