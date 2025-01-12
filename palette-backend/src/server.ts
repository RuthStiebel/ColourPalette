import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db";
import paletteRoutes from "./routes/paletteRoutes";

// Load environment variables from a .env file into process.env
dotenv.config();

// Connect to the database
connectDB().catch((error) => {
  console.error(`Database connection error: ${error}`);
  process.exit(1); // Exit the server if DB connection fails
});

// Initialize the Express application
const app = express();

/* Middleware: */
// Enable CORS for handling requests from different origins
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// API Routes: Use routes defined in the paletteRoutes file
app.use("/api", paletteRoutes);

// Default Route: Root endpoint for basic connectivity check
app.get("/", (req: Request, res: Response) => {
  res.send("Color Palette Backend API is running...");
});

// Start the server and listen on the specified PORT (default: 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
