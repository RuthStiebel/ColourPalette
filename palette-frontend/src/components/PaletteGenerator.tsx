import React from 'react';
import { Button, Card, CardContent, Typography, Stack, TextField } from '@mui/material';
import CircularLoader from './CircularLoader';
import { MAX_NUM_COLORS } from "../utils/globals";
import PaletteDisplay from './PaletteDisplay';
import  Wheel from '@uiw/react-color-wheel';

interface PaletteGeneratorProps {
  generatePalette: () => void;
  loading: boolean;
  errorMessage: string | null;
  keywords: string;
  setKeywords: React.Dispatch<React.SetStateAction<string>>;
  numColors: number;
  setNumColors: React.Dispatch<React.SetStateAction<number>>;
  palette: any;
}

const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({
  generatePalette,
  loading,
  errorMessage,
  keywords,
  setKeywords,
  numColors,
  setNumColors,
  palette,
}) => {
  const [selectedColor, setSelectedColor] = React.useState<string>('#FFFFFF'); // Store the selected color

  // Handle color change from the Wheel component
  const handleColorChange = (color: { hex: string }) => {
    setSelectedColor(color.hex); // Update the selected color when changed
    console.log("Selected Color:", color.hex);  // Log the selected color
  };

  // Handle random color generation
  const handleRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    setSelectedColor(randomColor);  // Set random color as the selected color
    console.log("Random Color:", randomColor);
  };

  return (
    <Card style={{ width: "66%", padding: "10px" }}>
      <CardContent>
        <Typography variant="h3" fontWeight="bold" align="center">
          Color Palette Generator
        </Typography>

        {/* Color Wheel */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", marginTop: "40px" }}>
          <Wheel
            color={selectedColor}
            onChange={handleColorChange}
            style={{ width: "300px", height: "300px" }}
          />
        </div>

        {/* First row layout: Color count, Selected Color, and Random button */}
        <Stack direction="row" spacing={2} alignItems="center" style={{ width: '100%' }}>
          <div style={{ flex: 1 }}>
            {/* Number of Colors input */}
            <TextField
              type="number"
              label="Number of Colors"
              variant="outlined"
              value={numColors}
              onChange={(e) => setNumColors(Number(e.target.value))}
              inputProps={{ min: 1, max: MAX_NUM_COLORS }}
              fullWidth
            />
          </div>

          <div style={{ flex: 1 }}>
            {/* Selected color rectangle */}
            <div
              style={{
                width: "100%",
                height: "56px", // Same height as the input box
                backgroundColor: selectedColor,
                borderRadius: "4px", // Border radius for consistency
                border: "1px solid #ccc", // Border for consistency
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            {/* Random Button */}
            <Button variant="contained" onClick={handleRandomColor} fullWidth>
              Random
            </Button>

          </div>
        </Stack>

        {/* Second row layout: Keywords and Generate button */}
        <Stack direction="row" spacing={2} alignItems="center" style={{ marginTop: "20px", width: '100%' }}>
          <div style={{ flex: 3 }}>
            {/* Keywords input box */}
            <TextField
              label="Keywords"
              variant="outlined"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              fullWidth
            />
          </div>

          <div style={{ flex: 1 }}>
            {/* Generate Button */}
            <Button variant="contained" onClick={generatePalette} fullWidth>
              Generate
            </Button>
          </div>
        </Stack>

        {/* Error message */}
        {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}

        {/* Loading spinner */}
        {loading && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <CircularLoader />
          </div>
        )}

        {/* Show generated palette */}
        {palette && (
          <div style={{ marginTop: '20px' }}>
            <PaletteDisplay palette={palette} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaletteGenerator;
