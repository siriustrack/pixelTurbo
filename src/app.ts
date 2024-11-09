import express from "express";
import cors from "cors";
import { securityHeaders, corsOptions } from "./middleware/security";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";
import conversionRoutes from "./routes/conversion";
import domainRoutes from "./routes/domain";
import eventRoutes from "./routes/event";
import facebookPixelRoutes from "./routes/facebookPixel";
import leadRoutes from "./routes/lead";

const app = express();

// Security Middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Rate Limiting
app.use("/api/", apiLimiter);

// Routes
app.use("/api/conversions", conversionRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/facebook-pixels", facebookPixelRoutes);
app.use("/api/leads", leadRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
