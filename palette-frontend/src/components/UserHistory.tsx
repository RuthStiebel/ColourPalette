import React from "react";
import { Card, CardContent, Stack, Typography, Button } from "@mui/material";
import { Palette } from "../../../palette-backend/src/models/paletteModels";
import DeleteIcon from "@mui/icons-material/Delete";

interface PaletteHistoryProps {
  userPalettes: Palette[];
  onSelectPalette: (palette: Palette) => void;
  clearHistory: () => void;
}

const PaletteHistory: React.FC<PaletteHistoryProps> = ({
  userPalettes,
  onSelectPalette,
  clearHistory,
}) => {
  return (
    <Card style={{ width: "33%", height: "95vh", overflowY: "auto", padding: "10px" }}>
      <CardContent>
        {/* User History Header with Clear Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <Typography variant="h5" fontWeight="bold">
            User History
          </Typography>
          <Button variant="outlined" color="error" onClick={clearHistory} endIcon={<DeleteIcon />} size = "small">
            Clear History
          </Button>
        </div>

      <Stack spacing={2}>
        {userPalettes.length === 0 ? (
          <Typography color="textSecondary" align="center">
            No palettes saved yet.
          </Typography>
        ) : (
          userPalettes
            .slice()
            .reverse()
            .map((palette) => (
              <Card
                key={palette.paletteId}
                onClick={() => onSelectPalette(palette)}
                style={{
                  cursor: "pointer",
                  borderRadius: "10px",
                  transition: "transform 0.2s ease-in-out",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <CardContent>
                <Typography color="textSecondary" fontWeight="normal" align="center" style={{ marginBottom: "8px" }}>
                  {palette.paletteId.split("\n")[0]}
                </Typography>

                  <Stack direction="row" spacing={1} justifyContent="center">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        style={{
                          width: "45px",
                          height: "20px",
                          backgroundColor: `rgb(${color.rgb.join(",")})`,
                          borderRadius: "6px",
                        }}
                      />
                    ))}
                  </Stack>

                  <Stack spacing={1} alignItems="center" style={{ marginTop: "8px" }}>
                    {palette.shades.map((shadesRow, rowIndex) => (
                      <Stack key={rowIndex} direction="row" spacing={1}>
                        {shadesRow.map((shade, shadeIndex) => (
                          <div
                            key={shadeIndex}
                            style={{
                              width: "30px",
                              height: "20px",
                              backgroundColor: `rgb(${shade.rgb.join(",")})`,
                              borderRadius: "4px",
                            }}
                          />
                        ))}
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ))
        )}
      </Stack>
      </CardContent>
    </Card>
  );
};

export default PaletteHistory;
