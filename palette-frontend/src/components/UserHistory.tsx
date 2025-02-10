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
                      <Stack direction="column" spacing={0}>
                        <Typography variant="h6" fontWeight="bold" style={{ marginBottom: "8px" }}>
                          {palette.paletteName}
                        </Typography>
                      </Stack>

                    {/* Colors Display */}
                    <Stack direction="row" spacing={0} style={{ width: "100%", marginTop: "8px" }}>
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          style={{
                            flexGrow: 1,
                            height: "40px",
                            backgroundColor: `rgb(${color.rgb.join(",")})`,
                            position: "relative",
                            cursor: "pointer",
                            borderRadius:
                              palette.colors.length === 1
                                ? "10px 10px 0 0"
                                : index === 0
                                ? "10px 0 0 0"
                                : index === palette.colors.length - 1
                                ? "0 10px 0 0"
                                : "0",
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                          }}
                        />
                      ))}
                    </Stack>


                  {/* Shades Display */}
                  <Stack direction="row" spacing={0} style={{ width: "100%"}}>
                      {palette.shades[0].map((shade, shadeIndex) => (
                        <React.Fragment key={shadeIndex}>
                          <div
                            style={{
                              flexGrow: 1,
                              height: "15px",
                              backgroundColor: `rgb(${shade.rgb.join(",")})`,
                              borderRadius: shadeIndex === 0 ? "0 0 0 10px" : "0",
                              cursor: "pointer",
                              position: "relative",
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                            }}
                          />
                          <div
                            style={{
                              flexGrow: 1,
                              height: "15px",
                              backgroundColor: `rgb(${palette.shades[1][shadeIndex].rgb.join(",")})`,
                              borderRadius: shadeIndex === palette.colors.length - 1 ? "0 0 10px 0" : "0",
                              cursor: "pointer",
                              position: "relative",
                            }}
                          />
                        </React.Fragment>
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
