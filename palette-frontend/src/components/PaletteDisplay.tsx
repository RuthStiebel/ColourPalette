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
        <Typography variant="h6" style={{ marginBottom: '10px' }}>
          {palette.paletteId}
        </Typography>

        {/* Colors Display */}
        <Stack direction="row" spacing={0} style={{ width: "100%" }}>
          {palette.colors.map((color, index) => (
            <div
              key={index}
              style={{
                flexGrow: 1,  // Each color will take up equal space in the row
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
        <Stack direction="row" spacing={0} style={{ width: "100%" }}> {/* Single row Stack */}
          {palette.shades[0].map((shade, shadeIndex) => ( // Iterate over the first row of shades
            <React.Fragment key={shadeIndex}> {/* Use Fragment to group elements */}
              <div
                style={{
                  flexGrow: 1,  // Each shade will take up equal space
                  height: "20px",
                  backgroundColor: `rgb(${shade.rgb.join(",")})`,
                  cursor: "pointer",
                  position: "relative",
                }}
                onMouseEnter={() => setHoveredColor(shade.hex)}
                onMouseLeave={() => setHoveredColor(null)}
              >
                {/* Show HEX Code on Hover */}
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
              {/* Render the corresponding shade from the second row */}
              <div
                style={{
                  flexGrow: 1,  // Each shade will take up equal space
                  height: "20px",
                  backgroundColor: `rgb(${palette.shades[1][shadeIndex].rgb.join(",")})`, // Access second row of shades
                  cursor: "pointer",
                  position: "relative",
                }}
                onMouseEnter={() => setHoveredColor(palette.shades[1][shadeIndex].hex)}
                onMouseLeave={() => setHoveredColor(null)}
              >
                {/* Show HEX Code on Hover */}
                {hoveredColor === palette.shades[1][shadeIndex].hex && (
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
                    {palette.shades[1][shadeIndex].hex}
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PaletteDisplay;
