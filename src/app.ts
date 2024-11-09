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
app.set("trust proxy", true);
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(loggerMiddleware);
app.use("/api/", apiLimiter);

const specs = swaggerJsdoc(swaggerDefinition);

// Middleware para remover ETag e forçar atualização de cache
app.get("/api-docs/swagger.json", (_req: any, res: any) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.status(200).json(specs);
});

// Adicione uma versão na URL do Swagger UI para forçar o refresh
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "PixelTurbo API Documentation",
  })
);

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/conversions", conversionRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/facebook-pixels", facebookPixelRoutes);
app.use("/api/leads", leadRoutes);

// Middleware de tratamento de erros
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
