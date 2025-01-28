import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Palette } from "../../palette-backend/src/models/paletteModels";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";

const App: React.FC = () => {
  const [keywords, setKeywords] = useState<string>("");
  const [numColors, setNumColors] = useState<number>(5);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [userPalettes, setUserPalettes] = useState<Palette[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const BACKEND_URL = "http://localhost:5000"; // Backend URL
  const MAX_NUM_COLORS = 5; // Maximum number of colors
  //const BACKEND_URL = "https://colourpalettebackend.onrender.com";

  useEffect(() => {
    // Check if a userId is already in local storage
    const storedUserId = localStorage.getItem("userId");
    
    if (storedUserId) {
      // If it exists, use it
      setUserId(storedUserId);
    } else {
      // If it doesn't exist, generate a new UUID
      const newUserId = uuidv4();
      setUserId(newUserId);
      localStorage.setItem("userId", newUserId); 
      console.log("new user id is: ", newUserId); //DEBUG
    }
  }, []);

  const fetchUserPalettes = async () => {
    if (!userId) return;  // Check if userId is available before fetching palettes
    
    try {
      console.log("Fetching user palettes for userId:", userId); //DEBUG
      const response = await fetch(`${BACKEND_URL}/api/palettes/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user palettes");
      }
      const data: Palette[] = await response.json();
      console.log("Fetched:", data); //DEBUG
      setUserPalettes(data);
    } catch (error) {
      console.error("Error fetching user palettes:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchUserPalettes();
  }, [userId]); // Fetch user palettes when userId changes

  const generatePalette = async () => {
    if (!userId) return;

    // Validate numColors input
    if (numColors > MAX_NUM_COLORS) {
      showPopupMessage(`The number of colors must be ${MAX_NUM_COLORS} or less.`);
      return; // Prevent palette generation if numColors is invalid
    }
    
    // Clear any previous error message
    setErrorMessage(null);
    setLoading(true);

    const requestData = {
      keywords: keywords,
      numColors,
      userId: userId,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/palettes/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {  // Handle the daily limit case
          showPopupMessage(errorData.message || "Daily limit reached.");
        } else {
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        return;
      }

      const data: Palette = await response.json();
      console.log("Generated palette:", data); //DEBUG
      // Update local state without fetching again
      setPalette(data);
      setUserPalettes((prev) => [...prev, data]);
    } catch (err: any) {
      console.error("Error generating palette:", err);
      setErrorMessage(err.message || "An error occurred.");
    } finally {
      setLoading(false); // End loading 
    }
  };

  const showPopupMessage = (message: string) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(null), 5000); // Popup disappears after 5 seconds
  };

  const clearHistory = () => {
    setUserPalettes([]); // Set userPalettes to an empty array
    localStorage.removeItem("palettes"); // Remove palettes from localStorage
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

      {/* User History Section */}
      <div style={{ width: "30%", paddingRight: "20px", borderRight: "1px solid #ccc" }}>
        <h2>User History</h2>
        <Button variant="contained" color="error" fullWidth onClick={clearHistory}>
          Clear History
        </Button>
        <Stack spacing={2}>
          {userPalettes.slice().reverse().map((palette) => (
            <Card key={palette.paletteId}>
              <CardContent>
                <Typography variant="subtitle1" align="center" gutterBottom>
                  {palette.paletteId}
                </Typography>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {palette.colors.map((color, index) => (
                    <div key={index} style={{ display: "flex", flexDirection: "column" }}>
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: `rgb(${color.rgb.join(",")})`,
                        }}
                      ></div>
                      {/* Display shades */}
                      <div
                        style={{
                          width: "50px",
                          height: "20px",
                          backgroundColor: `rgb(${palette.shades[0][index].rgb.join(",")})`,
                        }}
                      ></div>
                      <div
                        style={{
                          width: "50px",
                          height: "20px",
                          backgroundColor: `rgb(${palette.shades[1][index].rgb.join(",")})`,
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setPalette(palette)}
                  style={{ marginTop: "10px" }}
                >
                  Show Palette
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </div>

      {/* Generate Palette Section */}
      <div style={{ width: "75%", paddingLeft: "20px" }}>
        <h1>Generate Color Palette</h1>
        <input type="text" placeholder="Keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
        <input type="number" min="1" max={MAX_NUM_COLORS} value={numColors} onChange={(e) => setNumColors(Number(e.target.value))} />
        <Button variant="contained" onClick={generatePalette}>Generate</Button>
        {errorMessage && <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>}
        {loading && <div style={{ marginTop: "20px" }}><strong>Loading...</strong></div>}

        {/* Display Generated Palette */}
        {palette && (
          <Card style={{ marginTop: "20px" }}>
            <CardContent>
              <Typography variant="h5">{palette.paletteId}</Typography>
              <div style={{ display: "flex", flexDirection: "row" }}>
                {palette.colors.map((color, index) => (
                  <div key={index} style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: `rgb(${color.rgb.join(",")})`,
                      }}
                    ></div>
                    <div
                      style={{
                        width: "50px",
                        height: "20px",
                        backgroundColor: `rgb(${palette.shades[0][index].rgb.join(",")})`,
                      }}
                    ></div>
                    <div
                      style={{
                        width: "50px",
                        height: "20px",
                        backgroundColor: `rgb(${palette.shades[1][index].rgb.join(",")})`,
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default App;
