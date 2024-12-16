import express from "express"; // Express framework for creating the server
import dotenv from "dotenv"; // For loading environment variables
import cors from "cors"; // Middleware for enabling Cross-Origin Resource Sharing (CORS)
import bodyParser from "body-parser"; // Middleware for parsing request bodies
import connectDB from "./config/db"; // Database connection logic
import paletteRoutes from "./routes/paletteRoutes"; // Importing routes for handling palette-related API requests

// Load environment variables from a .env file into process.env
dotenv.config();

// Connect to the database (e.g., MongoDB)
connectDB();

// Initialize the Express application
const app = express();

// Middleware: Enable CORS for handling requests from different origins
app.use(cors());

// Middleware: Parse incoming JSON requests
app.use(bodyParser.json());

// API Routes: Use routes defined in the paletteRoutes file for '/api' endpoint
app.use("/api", paletteRoutes);

// Default Route: Root endpoint for basic connectivity check
app.get("/", (req, res) => {
  res.send("Color Palette Backend API is running...");
});

// Start the server and listen on the specified PORT (default: 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
