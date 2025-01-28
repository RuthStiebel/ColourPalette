import React from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { Palette } from "../../../palette-backend/src/models/paletteModels";

interface PaletteDisplayProps {
  palette: Palette | null;
}

const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ palette }) => {
  if (!palette) return null;

  return (
    <Card style={{ marginTop: "20px" }}>
      <CardContent>
        <Typography variant="h5">{palette.paletteId}</Typography>
        <Stack direction="row" spacing={0}>
          {palette.colors.map((color, index) => (
            <div
              key={index}
              style={{
                width: "50px",
                height: "50px",
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
      </CardContent>
    </Card>
  );
};

export default PaletteDisplay;
