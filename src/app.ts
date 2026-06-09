import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import nakshatraRoutes from "./routes/nakshatra.routes.js";
import poojaRoutes from "./routes/pooja.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Temple Billing API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/nakshatras", nakshatraRoutes);
app.use("/api/poojas", poojaRoutes);
app.use("/api/inventory", inventoryRoutes);

export default app;
