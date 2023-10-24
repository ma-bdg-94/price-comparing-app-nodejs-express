const express = require("express");
const router = express.Router();

const userRoutes = require("./user.route");
const screenRoutes = require('./link.route')

router.use("/api/users", userRoutes);
router.use("/api/screens", screenRoutes);

module.exports = router;
