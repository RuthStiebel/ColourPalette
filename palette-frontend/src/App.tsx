import React, { useState } from "react";
import { Palette } from '../../palette-backend/src/models/paletteModels';

const App: React.FC = () => { 
  // State to manage user input for keywords (comma-separated values)
  const [keywords, setKeywords] = useState<string>("");

  // State to manage user input for the number of colors to generate (default: 5)
  const [numColors, setNumColors] = useState<number>(5);

  // State to store the generated palette object retrieved from the API
  const [palette, setPalette] = useState<Palette | null>(null); // Type the palette state

  const generatePalette = async () => {
    const requestData = {
      keywords: keywords,
      numColors,
      userId: "testUser123",
    };

    console.log("Request Data:", requestData); // DEBUG Log the data being sent

    try {
      const response = await fetch("http://localhost:5000/api/palettes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorData = await response.json(); // Try to parse error message from server
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      
      const data : Palette = await response.json();
      console.log("Response Data:", data); // DEBUG Log the data received from the backend
      setPalette(data.palette);

    } catch (err : any) {
      console.error("Error generating palette:", err);
    }
  };
  
  return (
    <div style={{ padding: "20px" }}>
      {/* App Header */}
      <h1>Generate Color Palette</h1>

      {/* Input Section */}
      <div>
        {/* Input field for keywords */}
        <input
          type="text"
          placeholder="Keywords (comma-separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />

        {/* Input field for the number of colors*/}
        <input
          type="number"
          min="1"
          max="10"
          value={numColors}
          onChange={(e) => setNumColors(Number(e.target.value))}
        />

        {/* Button to trigger palette generation */}
        <button onClick={generatePalette}>Generate</button>
      </div>

      {/* Display Section */}
      {/* DEBUG Log the palette state */}
      {palette && (
        <div>
          {/* Display the palette id */}
          <h2>Palette: {palette.paletteId}</h2>
    
          {/* Display the palette colors as colored squares */}
          <div className="palette">
            {/* Map over the colors array and display a colored square for each color */}
            {palette.colors.map((color: any, index: number) => (
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

          {/* Display the palette's generation history */}
          <h3>History:</h3>
          <ul>
            {palette.history.map((entry: string, index: number) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;