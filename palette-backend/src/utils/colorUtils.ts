import { Color } from "../models/paletteModels";
import getOpenAIClient from "../config/openai"; // Import the config function

export function validateNumColors(numColors: any): void {
  if (!numColors || isNaN(numColors) || numColors <= 0) {
    throw new Error("Invalid number of colors.");
  }
}

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

export function generateColors(num: number): { rgb: [number, number, number]; hex: string }[] {
  const colors: { rgb: [number, number, number]; hex: string }[] = [];
  for (let i = 0; i < num; i++) {
    // Generate a random hex color
    let hex = "#";
    for (let j = 0; j < 6; j++) {
      hex += Math.floor(Math.random() * 16).toString(16);
    }
    console.log("\nHex colour" + hex); //DEBUG
    const rgb = hexToRgb(hex); 

    if (rgb) { // Check if rgb conversion was successful
      colors.push({ hex, rgb });
    } else {
      // Handle the case where the hex code is invalid
      console.error("Generated invalid hex code:", hex);
      i--; // Decrement i to retry this color generation
    }
  }
  console.log("Generated colors:\n" + JSON.stringify(colors, null, 2)); //DEBUG
  return colors;
}

export function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

export function parseHexColors(content: string, numColors: number): Color[] {
  const hexColors = content.match(/#[a-fA-F0-9]{6}/g);

  if (!hexColors || hexColors.length < numColors) {
    throw new Error("Failed to generate enough colors from OpenAI response.");
  }
  console.log("Hex colours\n" + hexColors); //DEBUG
  return hexColors.slice(0, numColors).map((hex) => ({
    hex,
    rgb: hexToRgb(hex) as [number, number, number],
  }));
}

export async function callOpenAI(cleanKeywords: string[], numColors: number): Promise<{ hex: string }[]> {
  try {
    
    const client = await getOpenAIClient(); // Get the OpenAI client instance

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



