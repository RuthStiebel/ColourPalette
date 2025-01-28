import React from "react";
import ColorTile from "./ColorTile";
import { Palette } from "../../../palette-backend/src/models/paletteModels";

interface PaletteViewerProps {
  palette: Palette;
}

const PaletteViewer: React.FC<PaletteViewerProps> = ({ palette }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>{palette.paletteId}</h2>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {palette.colors.map((color, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "5px",
            }}
          >
            {/* Main Color */}
            <ColorTile rgb={color.rgb} />
            {/* Shades */}
            <div style={{ display: "flex", flexDirection: "column", marginTop: "5px" }}>
              {palette.shades[index].map((shade, shadeIndex) => (
                <ColorTile key={shadeIndex} rgb={shade.rgb} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaletteViewer;
