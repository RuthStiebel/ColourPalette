import express, { Request, Response } from "express";
import dotenv from "dotenv"; 
import cors from "cors"; 
import connectDB from "./config/db"; 
import paletteRoutes from "./routes/paletteRoutes";
import { Palette, Color} from "./models/paletteModels";

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
  const { numColors, keywords } = req.body;

  try {
    // Validate numColors
    if (!numColors || isNaN(numColors) || numColors <= 0) {
      throw new Error("Invalid number of colors.");
    }
    
    // Validate keywords (allowing empty keywords)
    let cleanKeywords: string[] | null = null; // Initialize as null
    if (keywords) { // Check if keywords exist
      if (typeof keywords !== "string") {
        throw new Error("Invalid keywords format. Keywords must be a string.");
      }

      cleanKeywords = keywords.trim().split(",").map(keyword => keyword.trim()); // Trim individual keywords
      if (cleanKeywords.some(keyword => keyword === "")) {
        throw new Error("Keywords cannot contain only whitespace.")
        }
    }

    // Generate a color palette logic
    const generatedColors: Color[] = []; // Array of Color objects
    for (let i = 0; i < numColors; i++) {
      const hexColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

      // Convert hex to RGB (helper function)
      const rgb = hexToRgb(hexColor);
      if (rgb) {
        generatedColors.push({ hex: hexColor, rgb: rgb });
      }
    }
    console.log("Generated Colors:", generatedColors);//DEBUG

    const palette: Palette = {
        paletteId: `palette-${cleanKeywords ? cleanKeywords.join('-') : 'no-keywords'}-${numColors}`, // Handle null cleanKeywords        
        createdAt: new Date(),
        colors: generatedColors,
        history: [], // Add history if needed
    };
    
    console.log("Generated Palette:", palette); //DEBUG

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

// Helper function to convert hex to RGB
function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}