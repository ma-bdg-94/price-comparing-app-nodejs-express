const status = require("http-status");
const { verifyToken } = require("./tokens");

function authorize(userTypes) {
  return function (req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(status.UNAUTHORIZED).json({
        success: false,
        status: status[status.UNAUTHORIZED],
        errors: ["Token not found or it is not valid!"],
        data: null,
      });
    }

    const token = authorizationHeader.replace("Bearer ", "");

    try {
      const decryptedToken = verifyToken(token, process.env.JWT_SECRET_ACCESS);

      if (userTypes) {
        const requiredTypes = Array.isArray(userTypes)
          ? userTypes
          : [userTypes];
        if (!requiredTypes.includes(decryptedToken.user.userType)) {
          return res.status(status.FORBIDDEN).json({
            success: false,
            status: status[status.FORBIDDEN],
            errors: ["You do not have the right to perform this action!"],
            data: null,
          });
        }
      }

      req.user = decryptedToken.user;
      next();
    } catch (error) {
      return res.status(status.UNAUTHORIZED).json({
        success: false,
        status: status[status.UNAUTHORIZED],
        errors: [error.message, "Token not found or it is not valid!"],
        data: null,
      });
    }
  };
}

module.exports = authorize;
