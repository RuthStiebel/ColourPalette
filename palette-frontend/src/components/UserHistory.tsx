import React from "react";
import { Palette } from '../../../palette-backend/src/models/paletteModels';

interface UserHistoryProps {
  userPalettes: Palette[];
  onSelectPalette: (palette: Palette) => void;
}

const UserHistory: React.FC<UserHistoryProps> = ({ userPalettes, onSelectPalette }) => {
  return (
    <div style={{ width: "30%", paddingRight: "20px", borderRight: "1px solid #ccc" }}>
      <h2>User History</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {userPalettes.slice().reverse().map((palette) => (
          <li key={palette.paletteId} style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {palette.colors.map((color, index) => (
                <div
                  key={index}
                  style={{
                    width: "70px",
                    height: "20px",
                    backgroundColor: `rgb(${color.rgb.join(",")})`,
                    marginRight: "5px",
                  }}
                ></div>
              ))}
            </div>
            <button style={{ marginTop: "10px" }} onClick={() => onSelectPalette(palette)}>
              View Palette
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserHistory;
