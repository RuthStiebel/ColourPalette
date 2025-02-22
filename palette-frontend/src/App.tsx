import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Palette } from "../../palette-backend/src/models/paletteModels";
import UserHistory from "./components/UserHistory";
import PaletteGenerator from './components/PaletteGenerator'; 
import { Container, Stack } from "@mui/material";
import { MAX_NUM_COLORS, BACKEND_URL } from "./utils/globals";

const App: React.FC = () => {
  const [keywords, setKeywords] = useState<string>("");
  const [numColors, setNumColors] = useState<number>(5);
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF'); // Store the selected color
  const [palette, setPalette] = useState<Palette | null>(null);
  const [userPalettes, setUserPalettes] = useState<Palette[]>([]);
  //const [paletteName, setPaletteName] = useState<Palette[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [showInfoPopup, setShowInfoPopup] = useState<boolean>(false);
  
  useEffect(() => {
  const hasSeenPopup = localStorage.getItem("hasSeenPopup");
    if (!hasSeenPopup) {
      setShowInfoPopup(true);
    }
  }, []);

  const closePopup = () => {
    setShowInfoPopup(false);
    localStorage.setItem("hasSeenPopup", "true");
  };

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
      selectedColor: selectedColor,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/palettes/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) { // Handle the daily limit case
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

  const clearHistory = async () => {
    if (!userId) return;

    try {
      // Clear from backend
      const response = await fetch(`${BACKEND_URL}/api/palettes/user/${userId}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      // Clear from local storage
      localStorage.removeItem("userPalettes");
      // Clear state
      setUserPalettes([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };
/*
  const editPaletteName = async () => {
      if (!paletteName) {
        setErrorMessage("Please enter a name.");
        return;
      }
  
      setLoading(true);
      setErrorMessage(null);
  
      try {
        console.log("Updating palette name:", paletteName);
        console.log(`Request put for api/palettes/${palette?.userId}/${palette?.createdAt}`); // Check if route is hit DEBUG
        const response = await fetch(`${BACKEND_URL}/api/palettes/${palette?.userId}/${palette?.createdAt}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: setErrorMessage }),
        });
        console.log ()
        if (!response.ok) {
          const data = await response.json();
          setErrorMessage(data.message || "Failed to update palette name");
          return;
        }
  
        // Update the local state with the new name
        const updatedPalette: Palette = await response.json();
  
        setPalette(updatedPalette);
      //  setUserPalettes((prev) => [...prev, updatedPalette]);
        
        // Refresh the page to reflect the updated name
        //window.location.reload(); // This will reload the page to reflect the update
      } catch (error) {
        console.error("Error updating palette:", error);
        setErrorMessage("An error occurred while updating the palette.");
      } finally {
        setLoading(false);
      }
  };
*/
  return (
    <Container>
      <Stack direction="row" spacing={2}>
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

        {showInfoPopup && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              left: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              zIndex: 1000,
            }}
          >
            <p>
              Welcome to Palette Generator! You can generate color palettes based on keywords and
              the number of colors you want. You can also select a color to generate a palette based
              on that color. Your generated palettes will be saved in your history.
            </p>
            <button onClick={closePopup}>Got it!</button>
          </div>
        )}

        {/* User History Section */}
        <UserHistory userPalettes={userPalettes} onSelectPalette={setPalette} clearHistory={clearHistory} />

        {/* Palette Generator Section with the card */}
        <PaletteGenerator
          generatePalette={generatePalette}
          loading={loading}
          errorMessage={errorMessage}
          keywords={keywords}
          setKeywords={setKeywords}
          numColors={numColors}
          setNumColors={setNumColors}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          palette={palette}
          //editPaletteName={editPaletteName}
        />
      </Stack>
    </Container>
  );
};

export default App;
