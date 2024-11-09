import express from "express";
import cors from "cors";
import conversionRoutes from "./routes/conversion";
import domainRoutes from "./routes/domain";
import eventRoutes from "./routes/event";
import facebookPixelRoutes from "./routes/facebookPixel";
import leadRoutes from "./routes/lead";

const app = express();

app.use(cors());
app.use(express.json());

// Integração das rotas
app.use("/api/conversions", conversionRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/facebook-pixels", facebookPixelRoutes);
app.use("/api/leads", leadRoutes);

export default app;
