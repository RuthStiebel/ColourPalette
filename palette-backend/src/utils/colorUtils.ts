import { Color } from "../models/paletteModels";
import getOpenAIClient from "../config/openai"; // Import the OpenAI client configuration

// Validate the number of colors
export function validateNumColors(numColors: any): void {
  if (!numColors || isNaN(numColors) || numColors <= 0) {
    throw new Error("Invalid number of colors.");
  }
}

// Validate and clean keyword input
export function validateAndCleanKeywords(keywords: any): string[] | null {
  if (!keywords) return null;

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
export function generateColors(num: number): Color[] {
  const colors: { rgb: [number, number, number]; hex: string }[] = [];
  for (let i = 0; i < num; i++) {
    // Generate a random hex color
    let hex = "#";
    for (let j = 0; j < 6; j++) {
      hex += Math.floor(Math.random() * 16).toString(16);
    }
    const rgb = hexToRgb(hex); 

    if (rgb) { // Check if rgb conversion was successful
      colors.push({ hex, rgb });
    } else {
      // Handle the case where the hex code is invalid
      console.error("Generated invalid hex code:", hex);
      i--; // Decrement i to retry this color generation
    }
  }
  return colors;
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')
}

// Convert hex to RGB
function hexToRgb(hex: string): [number, number, number] | null {
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
export function parseHexColors(content: string, numColors: number): Color[] {
  const hexColors = content.match(/#[a-fA-F0-9]{6}/g);

  if (!hexColors || hexColors.length < numColors) {
    throw new Error("Failed to generate enough colors from OpenAI response.");
  }
  return hexColors.slice(0, numColors).map((hex) => ({
    hex,
    rgb: hexToRgb(hex) as [number, number, number],
  }));
}
// Call OpenAI to generate colors based on keywords
export async function callOpenAI(cleanKeywords: string[], numColors: number): Promise<Color[]> {
  try {
    const client = await getOpenAIClient(); // Get the OpenAI client instance

     // Generate a prompt for OpenAI
    const prompt = `Generate a harmonious color palette with ${numColors} colors. 
    Keywords: ${cleanKeywords ? cleanKeywords.join(", ") : "none"}. 
    Use principles of color theory to ensure the palette is cohesive 
    (e.g., complementary, analogous, triadic, or monochromatic schemes). 
    Provide the colors in hex format along with descriptive names. 
    For example, you could use the following keywords: "ocean, sky, forest" to generate a nature-inspired palette. 
    The colors should be visually appealing and suitable for use in a web design project.`;

    

    // Fetch response from OpenAI API
    console.log("Prompt" + prompt); //DEBUG
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });


    console.log("API response" + response); //DEBUG
    const content = response.choices[0]?.message?.content;

    console.log("AI content" + content); //DEBUG
    
    if (!content) {
      throw new Error("OpenAI API did not return a valid response.");
    }
    
    // Extract color codes from response
    const generatedColors = parseHexColors(content, numColors)

    return generatedColors;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new Error("Failed to generate colors using OpenAI.");
  }
}

// Function to lighten or darken a color
function adjustColor(rgb: [number, number, number], amount: number): [number, number, number] {
    return rgb.map(c => {
        let newC = c + amount;
        newC = Math.max(0, Math.min(255, newC)); // Clamp between 0 and 255
        return newC;
    }) as [number, number, number];
}

export function generateShadesAndTints(colors: Color[], numColors: number): Color[][] {
    const allPalettes: Color[][] = [];
    allPalettes.push(colors); // Add the original palette
    for (let i=0; i<numColors; i++) {
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
    console.log("Generated shades:", allPalettes); //DEBUG
    return allPalettes;
}


