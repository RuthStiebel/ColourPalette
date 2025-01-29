import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Palette } from "../../palette-backend/src/models/paletteModels";
import UserHistory from "./components/UserHistory";
import PaletteDisplay from "./components/PaletteDisplay";
import CircularWithValueLabel from "./components/CircularWithValueLabel";
import { Button } from "@mui/material";
import { MAX_NUM_COLORS } from "./utils/globals";

const App: React.FC = () => {
  const [keywords, setKeywords] = useState<string>("");
  const [numColors, setNumColors] = useState<number>(5);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [userPalettes, setUserPalettes] = useState<Palette[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = uuidv4();
      setUserId(newUserId);
      localStorage.setItem("userId", newUserId);
    }
  }, []);

  const fetchUserPalettes = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/palettes/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user palettes");
      const data: Palette[] = await response.json();
      setUserPalettes(data);
    } catch (error) {
      console.error("Error fetching user palettes:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchUserPalettes();
  }, [userId]);

  const generatePalette = async () => {
    if (!userId) return;
    if (numColors > MAX_NUM_COLORS) {
      showPopupMessage(`The number of colors must be ${MAX_NUM_COLORS} or less.`);
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/palettes/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, numColors, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          showPopupMessage(errorData.message || "Daily limit reached.");
        } else {
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        return;
      }

      const data: Palette = await response.json();
      setPalette(data);
      setUserPalettes((prev) => [...prev, data]);
    } catch (err: any) {
      console.error("Error generating palette:", err);
      setErrorMessage(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const showPopupMessage = (message: string) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(null), 5000);
  };

  const clearHistory = () => {
    setUserPalettes([]);
    localStorage.removeItem("palettes");
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {popupMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          {popupMessage}
        </div>
      )}

      <UserHistory userPalettes={userPalettes} onSelectPalette={setPalette} clearHistory={clearHistory} />

      <div style={{ width: "75%", paddingLeft: "20px" }}>
        <h1>Generate Color Palette</h1>
        <input type="text" placeholder="Keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
        <input type="number" min="1" max={MAX_NUM_COLORS} value={numColors} onChange={(e) => setNumColors(Number(e.target.value))} />
        <Button variant="contained" onClick={generatePalette}>Generate</Button>
        {errorMessage && <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>}

        {loading && (
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
            <CircularWithValueLabel loading={loading} />
          </div>
        )}

        {palette && <PaletteDisplay palette={palette} />}
      </div>
    </div>
  );
};

export default App;
