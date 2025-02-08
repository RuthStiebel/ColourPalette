"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paletteModels_1 = require("../models/paletteModels");
const functionUtils_1 = require("../utils/functionUtils");
const colorUtils_1 = require("../utils/colorUtils");
const router = express_1.default.Router();
// Test route
router.get("/", (req, res) => {
    // console.log("Request received for /api"); // Check if route is hit DEBUG
    res.send("Palette API is running...");
});
router.get("/ichs", (req, res) => {
    res.send("Palette API ichs is running...");
});
// Get all palettes for a specific userId
router.get("/palettes/:userId", async (req, res) => {
    // console.log("Request received for /palettes/:userId"); // Check if route is hit DEBUG
    // console.log("Request params:", req.params);
    try {
        const userId = req.params.userId;
        // console.log("Fetching palettes for userId:", userId); // Check userId
        const palettes = await paletteModels_1.PaletteModel.find({ userId });
        // console.log("Palettes found:", palettes); // Log the palettes
        // console.log("Sending JSON response:", JSON.stringify(palettes, null, 2)); // Stringify for logging
        res.json(palettes);
        // console.log("Response sent successfully"); 
    }
    catch (error) {
        console.error("Error in /palettes/:userId:", error);
        res.status(500).json({ message: error.message });
    }
});
// Delete user palettes
router.delete("/palettes/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("Deleting palettes for userId:", userId); // DEBUG
        const deleted = await paletteModels_1.PaletteModel.deleteMany({ userId });
        if (deleted.deletedCount === 0) {
            res.status(404).json({ message: "No palettes found for this user." });
            console.log("No palettes found for this user."); // DEBUG
        }
        else {
            res.status(200).json({ message: "User palettes deleted successfully." });
            console.log("User palettes deleted successfully."); // DEBUG
        }
    }
    catch (error) {
        console.error("Error deleting palettes:", error);
        res.status(500).json({ message: "Error deleting palettes", error });
    }
});
// Generate a palette
router.post("/palettes/generate", async (req, res) => {
    // console.log("Incoming Request Data:", req.body); // Log the incoming JSON DEBUG
    try {
        const { keywords, numColors, selectedColor, userId } = req.body;
        // Check the user's daily limit
        const limitStatus = await (0, functionUtils_1.handleDailyLimit)(userId);
        if (limitStatus.status === "limit_exceeded") {
            res.status(429).json({
                message: "Daily limit reached. Please try again after midnight.",
                resetTime: limitStatus.resetTime,
            });
        }
        else {
            // Validate inputs
            (0, colorUtils_1.validateNumColors)(numColors);
            const cleanKeywords = (0, colorUtils_1.validateAndCleanKeywords)(keywords);
            let generatedColors;
            if (cleanKeywords == null) {
                generatedColors = await (0, colorUtils_1.generateColors)([], numColors, selectedColor);
            }
            else {
                generatedColors = await (0, colorUtils_1.generateColors)(cleanKeywords, numColors, '');
            }
            // Create a new palette
            const promptEntry = `Generated palette with ${cleanKeywords ? "keywords: " + cleanKeywords.join(", ") : "no keywords"}.`;
            const generatedShades = await (0, colorUtils_1.generateShadesAndTints)(generatedColors, generatedColors.length);
            const palette = new paletteModels_1.PaletteModel({
                paletteId: promptEntry + "\n" + new Date().toISOString(),
                createdAt: new Date().toISOString(),
                userId: userId,
                colors: generatedColors,
                shades: [generatedShades[1], generatedShades[2]],
            });
            await palette.save(); // Save the palette to the database
            // console.log("Palette Id:", palette.paletteId); //DEBUG   
            // console.log("Generated shades:", palette.shades); //DEBUG
            res.status(201).json({
                paletteId: palette.paletteId,
                createdAt: palette.createdAt,
                userId: palette.userId,
                colors: palette.colors,
                shades: palette.shades,
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Update palette name
router.put("/palettes/:userId/:createdAt", async (req, res) => {
    console.log("Request received for /palettes/:userId/:createdAt"); // Check if route is hit DEBUG
    const userId = req.params.userId;
    const createdAt = req.params.createdAt;
    const name = req.body.name;
    try {
        // Extract the palette using userId and timestamp
        const palette = await paletteModels_1.PaletteModel.findOne({ userId, createdAt });
        if (!palette) {
            res.status(404).json({ message: "Palette not found" });
        }
        else {
            console.log("Updating palette name:", name); // DEBUG
            const newId = name + "\n" + palette.paletteId.split("\n")[1];
            palette.paletteId = newId;
            console.log("New palette's id: ", JSON.stringify(newId)); // Check newId DEBUG
            console.log("New palette's name: ", newId.split("\n")[0]); // Check newId DEBUG
            await palette.save();
            res.status(200).json({ message: "Palette updated successfully", palette });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
/*
 router.get("/palettes/:paletteName/shades", async (req: Request, res: Response) => {
   try {
       const paletteName = req.params.paletteName;
       const palette = await Palette.findOne({ paletteName });

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
exports.default = router;
