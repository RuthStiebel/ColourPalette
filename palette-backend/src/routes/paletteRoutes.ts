import express, { Request, Response } from "express";
import Palette, { Palette as PaletteInterface } from "../models/paletteModels";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// POST /api/palettes/generate
router.post("/generate", async (req: Request, res: Response) => {
  const { keywords, numColors, userId } = req.body;

  try {
    const paletteId = uuidv4();
    const colors = generateColors(numColors);

    const palette: PaletteInterface = new Palette({
      paletteId,
      colors,
      history: [
        `Generated palette with ${keywords ? "keywords: " + keywords.join(", ") : "random colors"}.`,
      ],
    });

    await palette.save();

    res.status(201).json({
      paletteId: palette.paletteId,
      colors: palette.colors,
      history: palette.history,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Function to generate colors
function generateColors(num: number): { rgb: [number, number, number] }[] {
  const colors: { rgb: [number, number, number] }[] = [];
    for (let i = 0; i < num; i++) {
    colors.push({
      rgb: [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
      ],
    });
  }
  
  return colors;
}

export default router;

/*
import express, { Request, Response } from "express";
import Palette, { Palette as PaletteInterface } from "../models/paletteModels";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Test route
router.get("/", (req: Request, res: Response) => {
  res.send("Palette API is running...");
});

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

// Generate a palette
router.post("/palettes/generate", async (req: Request, res: Response) => {
  const { keywords, numColors } = req.body;

  try {
    const paletteId = uuidv4();
    const paletteName = keywords ? keywords.join(" ") : "Random Palette";
    const colors = generateColors(numColors);

    const palette: PaletteInterface = new Palette({
      paletteId,
      name: paletteName,
      colors,
      history: [
        `Generated palette with ${keywords ? "keywords: " + keywords.join(", ") : "random colors"}.`,
      ],
    });

    await palette.save();

    res.status(201).json({
      paletteId: palette.paletteId,
      colors: palette.colors,
      history: palette.history,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Function to generate colors
function generateColors(num: number): { rgb: [number, number, number] }[] {
  const colors: { rgb: [number, number, number] }[] = [];
  for (let i = 0; i < num; i++) {
    colors.push({
      rgb: [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
      ],
    });
  }
  return colors;
}

export default router;
*/
