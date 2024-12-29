"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paletteModels_1 = __importDefault(require("../models/paletteModels"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
// Test route
router.get("/", (req, res) => {
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
router.post("/generate", async (req, res) => {
    console.log("Incoming Request Data:", req.body); // Log the incoming JSON DEBUG
    const { keywords, numColors, userId } = req.body;
    try {
        const paletteId = (0, uuid_1.v4)();
        const colors = generateColors(numColors);
        const palette = new paletteModels_1.default({
            paletteId,
            colors,
            history: [
                `Generated palette with ${keywords ? "keywords: " + keywords.join(", ") : ""}.`,
            ],
        });
        await palette.save();
        res.status(201).json({
            paletteId: palette.paletteId,
            colors: palette.colors,
            history: palette.history,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Function to generate colors
function generateColors(num) {
    const colors = [];
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
exports.default = router;
