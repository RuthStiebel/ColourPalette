import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import paletteRoutes from "./routes/paletteRoutes";
import { Palette, Color } from "./models/paletteModels";
import OpenAI from "openai";

// Load environment variables from a .env file into process.env
dotenv.config();

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], 
});

console.log("OpenAI API Key:", process.env['OPENAI_API_KEY']);

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

app.post('/api/palettes/generate', async (req: Request, res: Response) => {
  const { numColors, keywords } = req.body;

  try {
    // Validate numColors
    if (!numColors || isNaN(numColors) || numColors <= 0) {
      throw new Error("Invalid number of colors.");
    }

    // Validate keywords (allowing empty keywords)
    let cleanKeywords: string[] | null = null; // Initialize as null
    if (keywords) {
      if (typeof keywords !== "string") {
        throw new Error("Invalid keywords format. Keywords must be a string.");
      }

      cleanKeywords = keywords.trim().split(",").map((keyword) => keyword.trim());
      if (cleanKeywords.some((keyword) => keyword === "")) {
        throw new Error("Keywords cannot contain only whitespace.");
      }
    }

    // Generate a prompt for OpenAI
    const prompt = `Generate a harmonious color palette with ${numColors} colors. Keywords: ${
      cleanKeywords ? cleanKeywords.join(", ") : "none"
    }. Provide colors in hex format.`;

    // Fetch response from OpenAI API
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("OpenAI API did not return a valid response.");
    }

    // Parse the OpenAI response into an array of hex colors
    const hexColors = content.match(/#[a-fA-F0-9]{6}/g);
    if (!hexColors || hexColors.length < numColors) {
      throw new Error("Failed to generate enough colors from OpenAI response.");
    }

    // Map hex colors to Color objects
    const generatedColors: Color[] = hexColors.slice(0, numColors).map((hex) => ({
      hex,
      rgb: hexToRgb(hex) as [number, number, number],
    }));

    const palette: Palette = {
      paletteId: `palette-${cleanKeywords ? cleanKeywords.join('-') : 'no-keywords'}-${numColors}`,
      createdAt: new Date(),
      colors: generatedColors,
      history: [], // Add history
    };

    // Respond with the generated palette
    res.status(201).json({ palette });
  } catch (error) {
    console.error("Error generating palette:", error);
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
