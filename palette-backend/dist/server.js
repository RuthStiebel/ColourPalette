"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const paletteRoutes_1 = __importDefault(require("./routes/paletteRoutes"));
// Load environment variables from a .env file into process.env
dotenv_1.default.config();
// Connect to the database
(0, db_1.default)().catch((error) => {
    console.error(`Database connection error: ${error}`);
    process.exit(1); // Exit the server if DB connection fails
});
// Initialize the Express application
const app = (0, express_1.default)();
/* Middleware: */
// Enable CORS for handling requests from different origins
app.use((0, cors_1.default)());
// Parse incoming JSON requests
app.use(express_1.default.json());
// API Routes: Use routes defined in the paletteRoutes file for '/api' endpoint
app.use("/api", paletteRoutes_1.default);
app.post('/api/palettes/generate', (req, res) => {
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
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Default Route: Root endpoint for basic connectivity check
app.get("/", (req, res) => {
    res.send("Color Palette Backend API is running...");
});
// Start the server and listen on the specified PORT (default: 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
