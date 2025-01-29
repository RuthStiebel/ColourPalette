import React, { useState } from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { Palette } from "../../../palette-backend/src/models/paletteModels";

interface PaletteDisplayProps {
  palette: Palette | null;
}

const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ palette }) => {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  if (!palette) return null;

  return (
    <Card style={{ marginTop: "20px" }}>
      <CardContent>
        <Typography variant="h5">{palette.paletteId}</Typography>
        
        {/* Colors Display */}
        <Stack direction="row" spacing={0}>
        {palette.colors.map((color, index) => (
            <div
              key={index}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: `rgb(${color.rgb.join(",")})`,
                position: "relative",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredColor(color.hex)}
              onMouseLeave={() => setHoveredColor(null)}
            >
              {/* Show HEX Code on Hover */}
              {hoveredColor === color.hex && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "55px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "black",
                    color: "white",
                    padding: "5px",
                    borderRadius: "5px",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {color.hex}
                </div>
              )}
            </div>
          ))}
        </Stack>

        {/* Shades Display */}
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
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onMouseEnter={() => setHoveredColor(shade.hex)}
                  onMouseLeave={() => setHoveredColor(null)}
                >
                  {hoveredColor === shade.hex && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "25px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "black",
                        color: "white",
                        padding: "3px",
                        borderRadius: "5px",
                        fontSize: "10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {shade.hex}
                    </div>
                  )}
                </div>
              ))}
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PaletteDisplay;
