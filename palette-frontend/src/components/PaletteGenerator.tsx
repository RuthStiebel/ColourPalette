import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { MAX_NUM_COLORS } from ".././utils/globals";

interface PaletteGeneratorProps {
  keywords: string;
  setKeywords: React.Dispatch<React.SetStateAction<string>>;
  numColors: number;
  setNumColors: React.Dispatch<React.SetStateAction<number>>;
  generatePalette: (keywords: string, numColors: number) => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
}


const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({ generatePalette }) => {
  const [keywords, setKeywords] = useState<string>("");
  const [numColors, setNumColors] = useState<number>(5);

  return (
    <div>
      <h1>Generate Color Palette</h1>
      <TextField
        label="Keywords"
        variant="outlined"
        fullWidth
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <TextField
        label="Number of Colors"
        type="number"
        inputProps={{ min: 1, max: MAX_NUM_COLORS }}
        value={numColors}
        onChange={(e) => setNumColors(Number(e.target.value))}
      />
      <Button variant="contained" onClick={() => generatePalette(keywords, numColors)}>
        Generate Palette
      </Button>
    </div>
  );
};

export default PaletteGenerator;
