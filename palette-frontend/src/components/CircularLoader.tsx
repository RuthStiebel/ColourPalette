import React from "react";
import { CircularProgress, Box } from "@mui/material";

const CircularLoader: React.FC = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  );
};

export default CircularLoader;
