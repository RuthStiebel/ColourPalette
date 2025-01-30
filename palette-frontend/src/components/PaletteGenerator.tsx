// PaletteGenerator.tsx
import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import CircularLoader from './CircularLoader'; 
import { MAX_NUM_COLORS } from "../utils/globals"; 
import PaletteDisplay from './PaletteDisplay'; 

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
  return (
    <Card style={{ width: "66%", padding: "10px" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Generate Color Palette
        </Typography>

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
