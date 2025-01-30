import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import CircularLoader from './CircularLoader'; 
import { MAX_NUM_COLORS } from "../utils/globals"; 
import PaletteDisplay from './PaletteDisplay'; 
import Wheel from '@uiw/react-color-wheel';

//import ShadeSlider from '@uiw/react-color-shade-slider';
/*
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <ShadeSlider
            value={selectedColor}
            onChange={handleColorChange}
            style={{ width: "300px" }}
          />
        </div>
*/

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
  const [selectedColor, setSelectedColor] = React.useState<string>('#FFFFFF');
  
  // Handle color change from Wheel and ShadeSlider
  const handleColorChange = (color: { hex: string }) => {
    setSelectedColor(color.hex);
    console.log("Selected Color:", color.hex);  // You can send this color to your palette generation logic
  };

  return (
    <Card style={{ width: "66%", padding: "10px" }}>
      <CardContent>
        <Typography variant="h3" fontWeight="bold" align="center">
          Color Palette Generator
        </Typography>

        {/* Color Wheel */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "40px", marginBottom: "20px" }}>
          <Wheel
            color={selectedColor}
            onChange={handleColorChange}
            style={{
              width: "300px",
              height: "300px",
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
            className="custom-wheel"
          />
        </div>

        {/* Shade Slider */}

        {/* Form for keywords and number of colors */}
        <input
          type="text"
          placeholder="Keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <input
          type="number"
          min="1"
          max={MAX_NUM_COLORS}
          value={numColors}
          onChange={(e) => setNumColors(Number(e.target.value))}
        />
        <Button variant="contained" onClick={generatePalette}>
          Generate
        </Button>

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
