const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const env = require("./config/env");
const errorHandler = require("./middleware/error.middleware");
const notFound = require("./middleware/notFound.middleware");

// Route imports
const authRoutes = require("./routes/auth.routes");
const uploadRoutes = require("./routes/upload.routes");
const itineraryRoutes = require("./routes/itinerary.routes");
const shareRoutes = require("./routes/share.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.set("trust proxy", 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get('/',(req,res)=>{
  res.send("server is running")
})

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/shared", shareRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Itinerary sharing sub-routes (share/disable under itineraries)
const { protect } = require("./middleware/auth.middleware");
const {
  enableSharing,
  regenerateShareLink,
  disableSharing,
} = require("./controllers/share.controller");

app.post("/api/itineraries/:id/share", protect, enableSharing);
app.post("/api/itineraries/:id/share/regenerate", protect, regenerateShareLink);
app.patch("/api/itineraries/:id/share/disable", protect, disableSharing);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
