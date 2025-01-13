import express, { Request, Response } from "express";
import Palette from "../models/paletteModels";
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

// Get all palettes for a specific userId
router.get("/palettes/:userId", async (req, res) => {
  console.log("Request received for /palettes/:userId"); // Check if route is hit DEBUG
  console.log("Request params:", req.params);
  try {
      const userId = req.params.userId;
      console.log("Fetching palettes for userId:", userId); // Check userId
      const palettes = await Palette.find({ userId });
      console.log("Palettes found:", palettes); // Log the palettes
      console.log("Sending JSON response:", JSON.stringify(palettes, null, 2)); // Stringify for logging
      res.json(palettes);
      console.log("Response sent successfully"); 
  } catch (error) {
      console.error("Error in /palettes/:userId:", error);
      res.status(500).json({ message: (error as Error).message });
  }
});

// Generate a palette
router.post("/palettes/generate", async (req: Request, res: Response) => {
    console.log("Incoming Request Data:", req.body); // Log the incoming JSON DEBUG
    
    try {
      const { keywords, numColors, userId , previousHistory = [] } = req.body;
      console.log("Incoming History Request Data:", JSON.stringify(previousHistory, null, 2)); // Log the incoming history JSON DEBUG - here problem. should be arrayQQ
      
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

      // Create a new palette
      const historyEntry = `Generated palette with ${
        cleanKeywords ? "keywords: " + cleanKeywords.join(", ") : "no keywords"
      }.`;
      const palette = new Palette({
        paletteId:  historyEntry + " " + new Date().toISOString(),
        userId: userId,
        colors : generatedColors,
        history: [...previousHistory, historyEntry],
      });
           
      await palette.save(); // Save the palette to the database

      res.status(201).json({
        paletteId: palette.paletteId,
        userId: palette.userId,
        colors: palette.colors,
        history: palette.history,
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
   
  export default router;
