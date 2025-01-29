import React, { useEffect, useState } from "react";
import { CircularProgress, Typography, Box } from "@mui/material";

interface Props {
  loading: boolean;
}

const CircularWithValueLabel: React.FC<Props> = ({ loading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            return 100;
          }
          return oldProgress + 10;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [loading]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <CircularProgress variant="determinate" value={progress} />
      <Typography variant="caption" color="textSecondary">{`${progress}%`}</Typography>
    </Box>
  );
};

export default CircularWithValueLabel;
