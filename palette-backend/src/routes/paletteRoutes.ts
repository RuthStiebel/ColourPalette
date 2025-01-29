import express, { Request, Response } from "express";
import { PaletteModel } from "../models/paletteModels";
import { handleDailyLimit } from "../utils/functionUtils";
import { validateNumColors, validateAndCleanKeywords, generateColors, 
  callOpenAI, generateShadesAndTints } from "../utils/colorUtils";

const router = express.Router();

// Test route
router.get("/", (req: Request, res: Response) => {
  console.log("Request received for /api"); // Check if route is hit DEBUG
  res.send("Palette API is running...");
});

router.get("/ichs", (req: Request, res: Response) => {
  res.send("Palette API ichs is running...");
});

// Get all palettes for a specific userId
router.get("/palettes/:userId", async (req, res) => {
  console.log("Request received for /palettes/:userId"); // Check if route is hit DEBUG
  console.log("Request params:", req.params);
  try {
      const userId = req.params.userId;
      console.log("Fetching palettes for userId:", userId); // Check userId
      const palettes = await PaletteModel.find({ userId });
      console.log("Palettes found:", palettes); // Log the palettes
      console.log("Sending JSON response:", JSON.stringify(palettes, null, 2)); // Stringify for logging
      res.json(palettes);
      console.log("Response sent successfully"); 
  } catch (error) {
      console.error("Error in /palettes/:userId:", error);
      res.status(500).json({ message: (error as Error).message });
  }
});
/*
// Delete user palettes
router.delete("/palettes/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log("Deleting palettes for userId:", userId); // Debug log

    const deleted = await PaletteModel.deleteMany({ userId });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: "No palettes found for this user." });
    }

    res.status(200).json({ message: "User palettes deleted successfully." });
  } catch (error) {
    console.error("Error deleting palettes:", error);
    res.status(500).json({ message: "Error deleting palettes", error });
  }
});
*/
// Generate a palette
router.post("/palettes/generate", async (req: Request, res: Response) => {
    console.log("Incoming Request Data:", req.body); // Log the incoming JSON DEBUG
    
    try {
      const { keywords, numColors, userId } = req.body;
      
      // Check the user's daily limit
      const limitStatus = await handleDailyLimit(userId);

      if (limitStatus.status === "limit_exceeded") {
        res.status(429).json({
          message: "Daily limit reached. Please try again after midnight.",
          resetTime: limitStatus.resetTime,
        });
      } else {
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
        const promptEntry = `Generated palette with ${
          cleanKeywords ? "keywords: " + cleanKeywords.join(", ") : "no keywords"
        }.`;
  
        const generatedShades = await generateShadesAndTints(generatedColors, generatedColors.length);
  
        const palette = new PaletteModel({
          paletteId:  promptEntry + " \n" + new Date().toISOString(),
          userId: userId,
          colors : generatedColors,
          shades: [generatedShades[1], generatedShades[2]],
        });
        await palette.save(); // Save the palette to the database
        
        console.log("Palette ID:", palette.paletteId); //DEBUG   
        console.log("Generated shades:", palette.shades); //DEBUG
        res.status(201).json({
          paletteId: palette.paletteId,
          userId: palette.userId,
          colors: palette.colors,
          shades: palette.shades,
        });
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  
  
 /*
  router.get("/palettes/:paletteId/shades", async (req: Request, res: Response) => {
    try {
        const paletteId = req.params.paletteId;
        const palette = await Palette.findOne({ paletteId });

        if (!palette) {
            return res.status(404).json({ message: "Palette not found" });
        }
        if (palette.shades.length == 0) {
            const generatedShades = await generateShadesAndTints(palette.colors, palette.colors.length);
            palette.shades = [generatedShades[1], generatedShades[2], generatedShades[3], generatedShades[4]];
            await palette.save()
        }
        res.json(palette.shades);
    } catch (error) {
        console.error("Error fetching shades:", error);
        res.status(500).json({ message: (error as Error).message });
    }
  });*/
  export default router;
