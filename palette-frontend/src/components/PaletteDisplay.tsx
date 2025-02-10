import React, { useState } from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { Palette } from "../../../palette-backend/src/models/paletteModels";

interface PaletteDisplayProps {
  palette: Palette | null;
  editPaletteName: React.Dispatch<React.SetStateAction<string>>;
}

const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ palette, editPaletteName }) => {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  if (!palette) return null;

  return (
    <Card style={{ marginTop: "10px", borderRadius: "12px"}}>
      <CardContent>
      <Typography variant="h6" fontWeight="bold">
        {palette.paletteName}
      </Typography>
      
      <Typography variant="body2" style={{ color: "gray", fontSize: "0.8rem", marginBottom: "15px"}}>
        {new Date(palette.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}{" "}
        {new Date(palette.createdAt).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        })}
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
                borderRadius: palette.colors.length === 1 
                ? "10px 10px 0 0" // If only one color, round both edges
                : index === 0 
                  ? "10px 0 0 0"  // Round only the first color's left edge
                  : index === palette.colors.length - 1 
                    ? "0 10px 0 0" // Round only the last color's right edge
                    : "0", // No rounding for middle colors
                display: "grid",
                gridTemplateColumns: "1fr 1fr", 
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
                  flexGrow: 1,  // Each shade will take up equal space in the row
                  height: "20px",
                  backgroundColor: `rgb(${shade.rgb.join(",")})`,
                  borderRadius: shadeIndex === 0 ? "0 0 0 10px" : "0",
                  cursor: "pointer",
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr", // Splitting shades into two halves
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
                  borderRadius: shadeIndex === palette.colors.length - 1 ? "0 0 10px 0" : "0",
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

/* BUG - if a shadde is the exact same hex as another shade then when hovered both will appear over each color */