import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Stack, TextField } from '@mui/material';
import CircularLoader from './CircularLoader';
import { MAX_NUM_COLORS } from "../utils/globals";
import PaletteDisplay from './PaletteDisplay';
import Wheel from '@uiw/react-color-wheel';

interface PaletteGeneratorProps {
  generatePalette: () => void;
  loading: boolean;
  errorMessage: string | null;
  keywords: string;
  setKeywords: React.Dispatch<React.SetStateAction<string>>;
  numColors: number;
  setNumColors: React.Dispatch<React.SetStateAction<number>>;
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<any>>;
  palette: any;
  editPaletteName: React.Dispatch<React.SetStateAction<string>>;
}

const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({
  generatePalette,
  loading,
  errorMessage,
  keywords,
  setKeywords,
  numColors,
  setNumColors,
  selectedColor,
  setSelectedColor,
  palette,
  editPaletteName,
}) => {
  const [hovered, setHovered] = useState(false); // State to track hover

  // Handle color change from the Wheel component
  const handleColorChange = (color: { hex: string }) => {
    setSelectedColor(color.hex);
    document.body.style.backgroundColor = `${color.hex}`; // Adding '30' to the end makes it 48% opacity
    console.log("Selected Color:", color.hex);
  };
  
  // Handle random color generation
  const handleRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setSelectedColor(randomColor);
    console.log("Random Color:", randomColor);
  };

  return (
    <Card style={{ width: "66%", paddingTop: "10px", minHeight: "600px" }}>
      <CardContent>
        <Typography variant="h3" fontWeight="bold" align="center">
          Color Palette Generator
        </Typography>

        {/* Color Wheel */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            marginTop: "40px",
            opacity: keywords ? 0.4 : 1, // Fade when keywords are entered
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <Wheel width={300} height={300} color={selectedColor} onChange={handleColorChange} />
            
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: keywords? 'black' : selectedColor, 
                  },
                },
                "& .MuiInputLabel-root": {
                  color: 'black', // Change label color
                },
                "&.Mui-focused .MuiInputLabel-root": {
                  color: 'black', // Change label color on focus
                },
              }}
            />
          </div>

          <div
            style={{
              flex: 1,
              position: "relative",
              opacity: keywords ? 0.4 : 1, // Fade when keywords are entered
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            {/* Selected color rectangle */}
            <div
              style={{
                width: "100%",
                height: "56px",
                backgroundColor: selectedColor,
                borderRadius: "4px",
                border: "1px solid #ccc",
                cursor: "pointer",
                position: "relative",
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {/* Show HEX code on hover */}
              {hovered && (
                <div
                  style={{
                    position: "absolute",
                    top: "-25px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "black",
                    color: "white",
                    padding: "5px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedColor}
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {/* Random Button */}
              <Button
              variant="outlined"
              onClick={handleRandomColor}
              fullWidth
              sx={{
                backgroundColor: "#ffffff", // White background
                color:"#6c6c6c", 
                borderColor: "#6c6c6c", 
                "&:hover": {
                  backgroundColor:"#f3f3f3", 
                },
              }}>
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: 'black',
                  },
                },
                "& .MuiInputLabel-root": {
                  color: 'black', // Change label color
                },
                "&.Mui-focused .MuiInputLabel-root": {
                  color: 'black', // Change label color on focus
                },
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            {/* Generate Button */}
            <Button
              variant="outlined"
              onClick={generatePalette}
              fullWidth
              sx={{
                backgroundColor: "#ffffff", // White background
                color:"#6c6c6c", 
                borderColor: "#6c6c6c", 
                "&:hover": {
                  backgroundColor:"#f3f3f3", 
                },
              }}>
              Generate
            </Button>
          </div>
        </Stack>

        {/* Error message */}
        {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}

        {/* If loading spinner is going, it is shown instead of generated palette */}
        {loading ? (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <CircularLoader />
          </div>
        ) : (
          <div style={{ marginTop: '20px', minHeight: '150px' }}>
          {palette && (
            <PaletteDisplay palette={palette} editPaletteName={editPaletteName}/>
          )}          
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaletteGenerator;
//BUG - when the color picker is just loaded on white the the color number when selected is blue
