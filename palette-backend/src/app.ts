import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import paletteRoutes from "./routes/paletteRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/palettes", paletteRoutes);

export default app;