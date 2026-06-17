const express = require("express");
const router = express.Router();
const {
  generate,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/itinerary.controller");
const { protect } = require("../middleware/auth.middleware");
const { generateItineraryValidator } = require("../validators/itinerary.validator");
const { aiLimiter } = require("../middleware/rateLimit.middleware");

router.use(protect);

router.post("/generate", aiLimiter, generateItineraryValidator, generate);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
