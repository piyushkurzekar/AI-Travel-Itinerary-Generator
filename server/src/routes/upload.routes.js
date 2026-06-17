const express = require("express");
const router = express.Router();
const { extractBookings } = require("../controllers/upload.controller");
const { protect } = require("../middleware/auth.middleware");
const { upload } = require("../middleware/upload.middleware");
const { uploadLimiter, aiLimiter } = require("../middleware/rateLimit.middleware");

router.post(
  "/extract",
  protect,
  uploadLimiter,
  aiLimiter,
  upload.array("documents", 5),
  extractBookings
);

module.exports = router;
