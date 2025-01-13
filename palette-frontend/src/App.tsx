import React, { useState, useEffect, useRef } from "react";
import { Palette } from '../../palette-backend/src/models/paletteModels';

const App: React.FC = () => {
  const [keywords, setKeywords] = useState<string>("");
  const [numColors, setNumColors] = useState<number>(5);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [userPalettes, setUserPalettes] = useState<Palette[]>([]);
  const [userHistory, setUserHistory] = useState<string[]>([]);
  const userId = "testUser123";
  const paletteRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const fetchUserPalettes = async () => {
    try {
      const response = await fetch(`/api/palettes/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user palettes");
      }
      const data: Palette[] = await response.json();
      setUserPalettes(data);
      const userHistory = data.flatMap((palette) => palette.history);
      setUserHistory(userHistory);
    } catch (error) {
      console.error("Error fetching user palettes:", error);
    }
  };

  useEffect(() => {
    fetchUserPalettes();
  }, []);

  const generatePalette = async () => {
    const requestData = {
      keywords: keywords,
      numColors,
      userId: "testUser123",
      previousHistory: userHistory,
    };

    try {
      const response = await fetch("http://localhost:5000/api/palettes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data: Palette = await response.json();
      setPalette(data);
      fetchUserPalettes();
    } catch (err: any) {
      console.error("Error generating palette:", err);
    }
  };

  const scrollToPalette = (paletteId: string) => {
    if (paletteRefs.current[paletteId]) {
      paletteRefs.current[paletteId]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* Sidebar for user history */}
      <div style={{ width: "25%", paddingRight: "20px", borderRight: "1px solid #ccc" }}>
        <h2>User History</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {userPalettes.map((palette) => (
            <li key={palette.paletteId} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* Display color blocks */}
                {palette.colors.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: `rgb(${color.rgb.join(",")})`,
                      marginRight: "5px",
                    }}
                  ></div>
                ))}
              </div>
              <button
                style={{ marginTop: "5px" }}
                onClick={() => scrollToPalette(palette.paletteId)}
              >
                View Palette
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div style={{ width: "75%", paddingLeft: "20px" }}>
        <h1>Generate Color Palette</h1>

        <div>
          <input
            type="text"
            placeholder="Keywords (comma-separated)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <input
            type="number"
            min="1"
            max="10"
            value={numColors}
            onChange={(e) => setNumColors(Number(e.target.value))}
          />
          <button onClick={generatePalette}>Generate</button>
        </div>

        {palette && (
          <div
            ref={(el) => (paletteRefs.current[palette.paletteId] = el)}
            style={{ marginTop: "20px" }}
          >
            <h2>Palette: {palette.paletteId}</h2>
            <div style={{ display: "flex" }}>
              {palette.colors.map((color, index) => (
                <div
                  key={index}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: `rgb(${color.rgb.join(",")})`,
                  }}
                ></div>
              ))}
            </div>
            <h3>History:</h3>
            <ul>
              {palette.history.map((entry, index) => (
                <li key={index}>{entry}</li>
              ))}
            </ul>
          </div>
        )}

        {userPalettes.map((userPalette) => (
          <div
            key={userPalette.paletteId}
            ref={(el) => (paletteRefs.current[userPalette.paletteId] = el)}
            style={{ marginTop: "20px" }}
          >
            <h2>Palette: {userPalette.paletteId}</h2>
            <div style={{ display: "flex" }}>
              {userPalette.colors.map((color, index) => (
                <div
                  key={index}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: `rgb(${color.rgb.join(",")})`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
