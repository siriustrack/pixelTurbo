import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { securityHeaders, corsOptions } from "./middleware/security";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";
import { loggerMiddleware } from "./utils/requestLogger";
import swaggerDefinition from "./docs/swaggerDef";
import authRoutes from "./routes/auth";
import conversionRoutes from "./routes/conversion";
import domainRoutes from "./routes/domain";
import eventRoutes from "./routes/event";
import facebookPixelRoutes from "./routes/facebookPixel";
import leadRoutes from "./routes/lead";

const app = express();
// Habilite a configuração trust proxy para ambientes com proxy reverso
app.set("trust proxy", true);

// Security Middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Logging Middleware
app.use(loggerMiddleware);

// Rate Limiting
app.use("/api/", apiLimiter);

// Swagger Documentation
const specs = swaggerJsdoc(swaggerDefinition);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "PixelTurbo API Documentation",
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/conversions", conversionRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/facebook-pixels", facebookPixelRoutes);
app.use("/api/leads", leadRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
