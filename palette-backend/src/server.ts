import express, { Request, Response } from "express";
import dotenv from "dotenv"; 
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

// API Routes: Use routes defined in the paletteRoutes file for '/api' endpoint
app.use("/api", paletteRoutes);

app.post('/api/palettes/generate', (req: Request, res: Response) => {
  const { numColors } = req.body;

  try {
    // Validate numColors
    if (!numColors || isNaN(numColors) || numColors <= 0) {
      throw new Error("Invalid number of colors.");
    }

    // Generate a color palette logic
    const palette = [];
    for (let i = 0; i < numColors; i++) {
      // Generate random colors
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      palette.push(randomColor);
    }

    // Respond with the generated palette
    res.status(201).json({ palette });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Default Route: Root endpoint for basic connectivity check
app.get("/", (req: Request, res: Response) => {
  res.send("Color Palette Backend API is running...");
});

// Start the server and listen on the specified PORT (default: 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

