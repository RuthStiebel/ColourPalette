"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNumColors = validateNumColors;
exports.validateAndCleanKeywords = validateAndCleanKeywords;
exports.generateRandomColors = generateRandomColors;
exports.parseHexColors = parseHexColors;
exports.generateColors = generateColors;
exports.generateShadesAndTints = generateShadesAndTints;
const openai_1 = __importDefault(require("../config/openai")); // Import the OpenAI client configuration
// Validate the number of colors
function validateNumColors(numColors) {
    if (!numColors || isNaN(numColors) || numColors <= 0) {
        throw new Error("Invalid number of colors.");
    }
}
// Validate and clean keyword input
function validateAndCleanKeywords(keywords) {
    if (!keywords)
        return null;
    if (typeof keywords !== "string") {
        throw new Error("Invalid keywords format. Keywords must be a string.");
    }
    const cleanKeywords = keywords.trim().split(",").map((keyword) => keyword.trim());
    if (cleanKeywords.some((keyword) => keyword === "")) {
        throw new Error("Keywords cannot contain only whitespace.");
    }
    return cleanKeywords;
}
// Generate random colors if no keywords are provided
function generateRandomColors(num) {
    const colors = [];
    for (let i = 0; i < num; i++) {
        // Generate a random hex color
        let hex = "#";
        for (let j = 0; j < 6; j++) {
            hex += Math.floor(Math.random() * 16).toString(16);
        }
        const rgb = hexToRgb(hex);
        if (rgb) { // Check if rgb conversion was successful
            colors.push({ hex, rgb });
        }
        else {
            // Handle the case where the hex code is invalid
            // console.error("Generated invalid hex code:", hex);
            i--; // Decrement i to retry this color generation
        }
    }
    return colors;
}
// Convert RGB to hex
function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}
// Convert hex to RGB
function hexToRgb(hex) {
    // Remove the # if it exists
    hex = hex.replace("#", "");
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return null;
    }
    return [r, g, b];
}
// Parse hex colors from OpenAI response
function parseHexColors(content, numColors) {
    const hexColors = content.match(/#[a-fA-F0-9]{6}/g);
    if (!hexColors || hexColors.length < numColors) {
        throw new Error("Failed to generate enough colors from OpenAI response.");
    }
    return hexColors.slice(0, numColors).map((hex) => ({
        hex,
        rgb: hexToRgb(hex),
    }));
}
// Call OpenAI to generate colors based on keywords
async function generateColors(cleanKeywords, numColors, selectedColor) {
    try {
        const client = await (0, openai_1.default)(); // Get the OpenAI client instance
        // Generate a prompt for OpenAI
        let prompt = `Generate a harmonious color palette with ${numColors} colors.`;
        if (cleanKeywords.length == 0) {
            prompt += ` With ${selectedColor} as the main color.`;
        }
        else {
            prompt += ` Keywords: ${cleanKeywords.join(", ")}.`;
        }
        prompt += `Use principles of color theory to ensure the palette is cohesive 
    (e.g., complementary, analogous, triadic, or monochromatic schemes). 
    Provide the colors in hex format along with descriptive names. 
    For example, you could use the following keywords: "ocean, sky, forest" to generate a nature-inspired palette. 
    The colors should be visually appealing and suitable for use in a web design project.`;
        // Fetch response from OpenAI API
        //  console.log("Prompt" + prompt); //DEBUG
        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
        });
        // console.log("API response" + response); //DEBUG
        const content = response.choices[0]?.message?.content;
        // console.log("AI content" + content); //DEBUG
        if (!content) {
            throw new Error("OpenAI API did not return a valid response.");
        }
        // Extract color codes from response
        const generatedColors = parseHexColors(content, numColors);
        return generatedColors;
    }
    catch (error) {
        // console.error("Error calling OpenAI:", error);
        throw new Error("Failed to generate colors using OpenAI.");
    }
}
// Function to lighten or darken a color
function adjustColor(rgb, amount) {
    return rgb.map(c => {
        let newC = c + amount;
        newC = Math.max(0, Math.min(255, newC)); // Clamp between 0 and 255
        return newC;
    });
}
function generateShadesAndTints(colors, numColors) {
    const allPalettes = [];
    allPalettes.push(colors); // Add the original palette
    for (let i = 0; i < numColors; i++) {
        const rgb = colors[i].rgb;
        if (rgb) {
            const darker1 = adjustColor(rgb, -60); // Slightly darker
            const darker2 = adjustColor(rgb, -100); // Much darker
            //  const lighter1 = adjustColor(rgb, 20); // Slightly lighter
            //  const lighter2 = adjustColor(rgb, 40); // Much lighter
            const darker1Hex = rgbToHex(...darker1);
            const darker2Hex = rgbToHex(...darker2);
            //  const lighter1Hex = rgbToHex(...lighter1);
            //  const lighter2Hex = rgbToHex(...lighter2);
            if (allPalettes.length == 1) {
                allPalettes.push([{ hex: darker1Hex, rgb: darker1 }]);
                allPalettes.push([{ hex: darker2Hex, rgb: darker2 }]);
                //     allPalettes.push([{ hex: lighter1Hex, rgb: lighter1 }]);
                //     allPalettes.push([{ hex: lighter2Hex, rgb: lighter2 }]);
            }
            else {
                allPalettes[1].push({ hex: darker1Hex, rgb: darker1 });
                allPalettes[2].push({ hex: darker2Hex, rgb: darker2 });
                //      allPalettes[3].push({ hex: lighter1Hex, rgb: lighter1 });
                //      allPalettes[4].push({ hex: lighter2Hex, rgb: lighter2 });
            }
        }
    }
    // console.log("Generated shades:", allPalettes); //DEBUG
    return allPalettes;
}
