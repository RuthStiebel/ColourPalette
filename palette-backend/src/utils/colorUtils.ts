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

  const cleanKeywords = keywords
    .trim()
    .split(",")
    .map((keyword) => keyword.trim());
  if (cleanKeywords.some((keyword) => keyword === "")) {
    throw new Error("Keywords cannot contain only whitespace.");
  }

  return cleanKeywords;
}

// Generate random colors if no keywords are provided

export function generateRandomColors(
  selectedColor: string,
  num: number,
): Color[] {
  const colors: Color[] = [];
  const baseRgb = hexToRgb(selectedColor);

  if (!baseRgb) {
    console.error("Invalid base hex code:", selectedColor);
    return colors;
  }

  // Convert base color to HSL for cohesive manipulation
  const [h, s, l] = rgbToHsl(baseRgb[0], baseRgb[1], baseRgb[2]);

  for (let i = 0; i < num; i++) {
    // 1. Shift Hue: Shift by 15 degrees per step to create an "Analogous" palette.
    // Centering the shift so the original color is near the middle of the palette.
    const hueShift = (i - Math.floor(num / 2)) * 15;
    let newH = (h + hueShift) % 360;
    if (newH < 0) newH += 360; // Keep hue within 0-360 degrees

    // 2. Shift Lightness: Slightly vary lightness to ensure the colors are distinguishable.
    let newL = l;
    if (num > 1) {
      // Shift lightness by up to +/- 20% across the palette length
      const lightnessShift = (i / (num - 1) - 0.5) * 0.4;
      // Clamp lightness between 10% and 90% so it doesn't turn pure white or black
      newL = Math.max(0.1, Math.min(0.9, l + lightnessShift));
    }

    // Convert back to RGB and Hex
    const rgb = hslToRgb(newH, s, newL);
    const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);

    colors.push({ hex, rgb });
  }

  return colors;
}

//Helper functions for color conversions

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
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

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
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
/*
// Call OpenAI to generate colors based on keywords
export async function generateColors(cleanKeywords: string[], numColors: number, selectedColor: string): Promise<Color[]> {
  try {
    const client = await getOpenAIClient(); // Get the OpenAI client instance
    
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
    const generatedColors = parseHexColors(content, numColors)

    return generatedColors;
  } catch (error) {
    // console.error("Error calling OpenAI:", error);
    throw new Error("Failed to generate colors using OpenAI.");
  }
}
*/
// Function to lighten or darken a color
function adjustColor(
  rgb: [number, number, number],
  amount: number,
): [number, number, number] {
  return rgb.map((c) => {
    let newC = c + amount;
    newC = Math.max(0, Math.min(255, newC)); // Clamp between 0 and 255
    return newC;
  }) as [number, number, number];
}

export function generateShadesAndTints(
  colors: Color[],
  numColors: number,
): Color[][] {
  const allPalettes: Color[][] = [];
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
      } else {
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
