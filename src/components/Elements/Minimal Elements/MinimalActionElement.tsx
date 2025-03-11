import { ReactNode } from "react";
import {
  Tooltip,
  IconButton,
  CircularProgress,
  ButtonProps,
} from "@mui/material";

interface MinimalActionElementProps {
  icon: ReactNode;
  tooltip: string;
  onClick: () => void;
  loading?: boolean;
  buttonColor?: ButtonProps["color"];
  buttonVariant?: ButtonProps["variant"];
}

export const MinimalActionElement = ({
  icon,
  tooltip,
  onClick,
  loading = false,
  buttonColor = "primary",
}: MinimalActionElementProps) => {
  return (
    <Tooltip title={tooltip} arrow>
      <IconButton
        onClick={onClick}
        color={buttonColor}
        disabled={loading}
        loading={loading}
        loadingIndicator={<CircularProgress size={20} color="inherit" />}
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};
