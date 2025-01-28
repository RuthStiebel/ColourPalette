import React, { useState } from "react";

interface ColorTileProps {
  rgb: number[];
}

const ColorTile: React.FC<ColorTileProps> = ({ rgb }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hex = `#${rgb.map((val) => val.toString(16).padStart(2, "0")).join("")}`;

  return (
    <div
      style={{
        position: "relative",
        width: "50px",
        height: "50px",
        backgroundColor: `rgb(${rgb.join(",")})`,
        margin: "5px",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "5px 10px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            borderRadius: "5px",
            fontSize: "12px",
            zIndex: 10,
          }}
        >
          {hex}
        </div>
      )}
    </div>
  );
};

export default ColorTile;
