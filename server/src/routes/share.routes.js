const express = require("express");
const router = express.Router();
const {
  enableSharing,
  regenerateShareLink,
  disableSharing,
  getShared,
} = require("../controllers/share.controller");
const { protect } = require("../middleware/auth.middleware");

// Public route - no auth required
router.get("/:shareId", getShared);

// Protected routes
router.post("/itineraries/:id/share", protect, enableSharing);
router.post("/itineraries/:id/share/regenerate", protect, regenerateShareLink);
router.patch("/itineraries/:id/share/disable", protect, disableSharing);

module.exports = router;
