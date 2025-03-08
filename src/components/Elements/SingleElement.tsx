import { ReactNode } from "react";
import { Paper, Typography, Box } from "@mui/material";

interface SingleElementProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  textColor?: string;
}

export const SingleElement = ({ icon, title, value, textColor }: SingleElementProps) => {
  return (
    <Paper
      variant="elevation"
      sx={{
        p: 3,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 1.5,
        position: "relative",
        minWidth: "200px",
      }}
    >
      {/* Icon at top-left */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0.5,
        }}
      >
        {icon}
      </Box>

      {/* Title */}
      <Typography variant="body1" align="center">
        {title}
      </Typography>

      {/* Value */}
      <Typography variant="h3" color={textColor ? textColor : "secondary" } align="center" >
        {value}
      </Typography>
    </Paper>
  );
};
