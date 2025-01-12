import express, { Request, Response } from "express";
import Palette from "../models/paletteModels";
import { v4 as uuidv4 } from "uuid";
import {
  validateNumColors,
  validateAndCleanKeywords,
  generateColors,
  callOpenAI,
} from "../utils/colorUtils";

const router = express.Router();

// Test route
router.get("/", (req: Request, res: Response) => {
  res.send("Palette API is running...");
});
/*
// Get all palettes
router.get("/palettes", async (req: Request, res: Response) => {
  try {
    const palettes = await Palette.find();
    res.json(palettes);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Add a new palette
router.post("/palettes", async (req: Request, res: Response) => {
  try {
    const newPalette = new Palette(req.body);
    const savedPalette = await newPalette.save();
    res.status(201).json(savedPalette);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});
*/
// Generate a palette
router.post("/palettes/generate", async (req: Request, res: Response) => {
    console.log("Incoming Request Data:", req.body); // Log the incoming JSON DEBUG
    
    try {
      const { keywords, numColors } = req.body;
            
      // Validate inputs
      validateNumColors(numColors);
      const cleanKeywords = validateAndCleanKeywords(keywords);
      
      let generatedColors;
      if (cleanKeywords == null) {
        generatedColors = await generateColors(numColors);
      }
      else {
        generatedColors = await callOpenAI(cleanKeywords, numColors);
      }
      console.log("Generated colors:\n" + JSON.stringify(generatedColors, null, 2)); //DEBUG

      // Create a new palette
      const palette = new Palette({
        paletteId:  uuidv4(),
        colors : generatedColors,
        history: [
          `Generated palette with ${cleanKeywords ? "keywords: " + cleanKeywords.join(", "):"no keywords"}.`,
        ],
      });
      
      console.log("Generated palette:\n" + JSON.stringify(palette, null, 2)); //DEBUG
      await palette.save(); // Save the palette to the database
  
      res.status(201).json({
        paletteId: palette.paletteId,
        colors: palette.colors,
        history: palette.history,
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
   
  export default router;
