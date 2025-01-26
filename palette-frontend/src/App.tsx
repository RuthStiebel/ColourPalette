import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid'; // Import the UUID generator
import { Palette } from '../../palette-backend/src/models/paletteModels';

const App: React.FC = () => {
  const [keywords, setKeywords] = useState<string>("");
  const [numColors, setNumColors] = useState<number>(5);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [userPalettes, setUserPalettes] = useState<Palette[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // For error messages
  const [loading, setLoading] = useState<boolean>(false); // New loading state
  const paletteRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const BACKEND_URL = "http://localhost:5000"; // Backend URL
  const MAX_NUM_COLORS = 5; // Maximum number of colors
  //const BACKEND_URL = "https://colourpalettebackend.onrender.com";

  useEffect(() => {
    // Check if a userId is already in local storage
    const storedUserId = localStorage.getItem('userId');

    if (storedUserId) {
        // If it exists, use it
        setUserId(storedUserId);
    } else {
        // If it doesn't exist, generate a new UUID
        const newUserId = uuidv4();
        setUserId(newUserId);
        localStorage.setItem('userId', newUserId); // Store it in local storage
        console.log("new user id is: ", newUserId)
    }
  }, []); // Empty dependency array ensures this runs only once

  const fetchUserPalettes = async () => {
    if (!userId) { // Check if userId is available before fetching
      return;
    }
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
    if (userId) {
        fetchUserPalettes();
    }
  }, [userId]); // Fetch user palettes when userId changes

  const generatePalette = async () => {
    if (!userId) return;

    // Validate numColors input
    if (numColors > MAX_NUM_COLORS) {
      setErrorMessage(`The number of colors must be ${MAX_NUM_COLORS} or less.`);
      return; // Prevent palette generation
    }

    // Clear any previous error message
    setErrorMessage(null);
    setLoading(true); // Start loading

    const requestData = {
      keywords: keywords,
      numColors,
      userId: userId,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/palettes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) { // Handle the daily limit case
          setErrorMessage(errorData.message || "Daily limit reached. Please try again after midnight.");
        } else {
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        return; // Stop further execution
      }

      const data: Palette = await response.json();
      console.log("Generated palette:", data); //DEBUG
      // Update local state without fetching again
      setPalette(data);
      setUserPalettes((prevPalettes) => [...prevPalettes, data]);
    } catch (err: any) {
      console.error("Error generating palette:", err);
      setErrorMessage(err.message || "An error occurred while generating the palette.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* Sidebar for user history */}
      <div style={{ width: "30%", paddingRight: "20px", borderRight: "1px solid #ccc" }}>
        <h2>User History</h2> 
        <ul style={{ listStyle: "none", padding: 0 }}>
          {/* Reverse the userPalettes array before mapping */}
          {userPalettes.slice().reverse().map((palette) => (
            <li key={palette.paletteId} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* Display color blocks */}
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
              <button style={{ marginTop: "10px" }}
                onClick={() => setPalette(palette)} >
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
            max={MAX_NUM_COLORS}
            value={numColors}
            onChange={(e) => setNumColors(Number(e.target.value))}
          />
          <button onClick={generatePalette}>Generate</button>
        </div>

        {/* Display error message if any */}
        {errorMessage && (
          <div style={{ color: "red", marginTop: "10px" }}>
            {errorMessage}
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div style={{ marginTop: "20px" }}>
            <strong>Loading...</strong>
          </div>
        )}

        {palette && (
          <div
            ref={(el) => (paletteRefs.current[palette.paletteId] = el)}
            style={{ marginTop: "20px" }}
          >
            <h2>{palette.paletteId}</h2>
            {/* Main Palette */}
            <div style={{ display: "flex" }}>
              {palette.colors.map((color, index) => (
                <div
                  key={index}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: `rgb(${color.rgb.join(",")})`,
                    margin: "5px",
                  }}
                ></div>
              ))}
            </div>
            {/* Shades */}
            <h3 style={{ marginTop: "20px" }}>Shades:</h3>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {palette.shades.map((shadesRow, rowIndex) => (
                <div
                  key={rowIndex}
                  style={{ display: "flex", marginBottom: "20px" }} // Adjust margin for row spacing
                >
                  {shadesRow.map((shade, shadeIndex) => (
                    <div
                      key={shadeIndex}
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: `rgb(${shade.rgb.join(",")})`,
                        margin: "5px",
                      }}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {userPalettes.map((userPalette) => (
          <div
            key={userPalette.paletteId}
            ref={(el) => (paletteRefs.current[userPalette.paletteId] = el)}
            style={{ marginTop: "20px" }}
          >
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
