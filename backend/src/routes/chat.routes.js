const express = require("express");
const { protectRoute } = require("../middleware/auth.middleware");
const { getStreamToken } = require("../controllers/chat.controller");

const router = express.Router();

router.get("/token", protectRoute,getStreamToken)

module.exports = router;