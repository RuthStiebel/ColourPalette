### **1. Generate Palette API**

#### **Purpose**:
To create a new palette based on user input. Users can provide:
1. Only the number of colors (to generate random palettes).
2. Or add keywords to represent themes (e.g., "sunset", "ocean").

#### **Endpoint**:
`POST /api/palettes/generate`

#### **Request Body**:
```json
{
  "inputType": "numColors",
  "inputValue": {
    "keywords": ["sunset", "beach"], 
    "numColors": 5 // Number of colors requested
  },
  "userId": "u12345" // For logged-in users
}
```

#### **Response**:
```json
{
  "paletteId": "p12345",
  "paletteName": "Sunset Beach",
  "colors": [
    { "id": "c1", "rgb": [255, 87, 51] },
    { "id": "c2", "rgb": [51, 164, 255] },
    { "id": "c3", "rgb": [255, 209, 51] }
  ],
  "history": [
    {
      "versionId": "v1",
      "timestamp": "2024-11-21T10:00:00Z",
      "action": "Generated palette with keywords: sunset, beach.",
      "palette": [
        { "id": "c1", "rgb": [255, 87, 51] },
        { "id": "c2", "rgb": [51, 164, 255] },
        { "id": "c3", "rgb": [255, 209, 51] }
      ]
    }
  ]
}
```

---

### **2. Revert Palette API**

#### **Purpose**:
To restore a palette to a previous version, updating the palette's history.

#### **Endpoint**:
`POST /api/palettes/{paletteId}/revert`

#### **Request Body**:
```json
{
  "versionId": "v1" // The version of the palette to revert to
}
```

#### **Response**:
```json
{
  "paletteId": "p12345",
  "paletteName": "Sunset Beach",
  "colors": [
    { "id": "c1", "rgb": [255, 87, 51] },
    { "id": "c2", "rgb": [51, 164, 255] }
  ],
  "currentVersion": "v1",
  "history": [
    {
      "versionId": "v1",
      "timestamp": "2024-11-21T10:00:00Z",
      "action": "Reverted to version v1.",
      "palette": [
        { "id": "c1", "rgb": [255, 87, 51] },
        { "id": "c2", "rgb": [51, 164, 255] }
      ]
    },
    {
      "versionId": "v2",
      "timestamp": "2024-11-22T12:00:00Z",
      "action": "Palette edited: Added new color.",
      "palette": [
        { "id": "c1", "rgb": [255, 87, 51] },
        { "id": "c2", "rgb": [51, 164, 255] },
        { "id": "c3", "rgb": [255, 209, 51] }
      ]
    }
  ]
}
```

---

### **3. Load User API**

#### **Purpose**:
To retrieve user-specific data, including their palettes and activity history.

#### **Endpoint**:
`GET /api/users/load`

#### **Request Query Parameter**:
```json
{
  "ipAddress": "192.168.1.1", // Required if no user ID is available
  "userId": "u12345" // Optional, for logged-in users
}
```

#### **Response**:
```json
{
  "userId": "u12345",
  "username": "john_doe",
  "recentPalettes": [
    { "paletteId": "p12345", "paletteName": "Sunset Beach" },
    { "paletteId": "p67890", "paletteName": "Winter Blues" }
  ],
  "history": [
    {
      "timestamp": "2024-11-21T09:30:00Z",
      "action": "Viewed palette Sunset Beach",
      "palette": [
        { "id": "c1", "rgb": [255, 87, 51] },
        { "id": "c2", "rgb": [51, 164, 255] }
      ]
    },
    {
      "timestamp": "2024-11-20T15:45:00Z",
      "action": "Generated palette Winter Blues",
      "palette": [
        { "id": "c4", "rgb": [106, 90, 205] },
        { "id": "c5", "rgb": [70, 130, 180] }
      ]
    }
  ]
}
```