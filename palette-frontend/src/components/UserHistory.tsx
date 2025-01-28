import React, { useState } from "react";
import { Card, CardContent, Stack, Typography, Button } from "@mui/material";
import { Palette } from "../../../palette-backend/src/models/paletteModels";
import PaletteDisplay from "./PaletteDisplay";

interface PaletteHistoryProps {
  userPalettes: Palette[];
  onSelectPalette: (palette: Palette) => void;
  clearHistory: () => void;  // Function to clear history
}

const PaletteHistory: React.FC<PaletteHistoryProps> = ({ userPalettes, onSelectPalette, clearHistory }) => {
  return (
    <div style={{ width: "30%", paddingRight: "20px", borderRight: "1px solid #ccc" }}>
      <div style={{marginBottom: "10px"}}>
      <h2>User History</h2>
      <Button variant="contained" color="error" fullWidth onClick={clearHistory}>
        Clear History
      </Button>
      </div>
      <Stack spacing={2}>
        {userPalettes.length === 0 ? (
          <Typography color="textSecondary">No palettes saved yet.</Typography>
        ) : (
          userPalettes.slice().reverse().map((palette) => (
            <Card key={palette.paletteId} onClick={() => onSelectPalette(palette)}>
              <CardContent>
                <Typography variant="h6">{palette.paletteId}</Typography>
                <Stack direction="row" spacing={0}>
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      style={{
                        width: "50px",
                        height: "20px",
                        backgroundColor: `rgb(${color.rgb.join(",")})`,
                      }}
                    />
                  ))}
                </Stack>
                <Stack spacing={0}>
                  {palette.shades.map((shadesRow, rowIndex) => (
                    <Stack key={rowIndex} direction="row" spacing={0}>
                      {shadesRow.map((shade, shadeIndex) => (
                        <div
                          key={shadeIndex}
                          style={{
                            width: "50px",
                            height: "20px",
                            backgroundColor: `rgb(${shade.rgb.join(",")})`,
                          }}
                        />
                      ))}
                    </Stack>
                  ))}
                </Stack>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() =>  {palette && <PaletteDisplay palette={palette} />}}
                  style={{ marginTop: "10px" }}
                >
                  Show Palette
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
      
    </div>
  );
};

export default PaletteHistory;
