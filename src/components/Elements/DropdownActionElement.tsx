import { useState, ReactNode } from "react";
import {
  Paper,
  Typography,
  Box,
  Menu,
  MenuItem,
  Button,
  ButtonProps,
} from "@mui/material";
import { ArrowDropDownRounded } from "@mui/icons-material";

interface DropdownActionElementProps {
  icon: ReactNode;
  title: string;
  buttonText: string;
  buttonIcon?: ReactNode;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  buttonVariant?: ButtonProps["variant"];
  buttonColor?: ButtonProps["color"];
}

export const DropdownActionElement = ({
  icon,
  title,
  buttonText,
  buttonIcon,
  options,
  onSelect,
  buttonVariant = "contained",
  buttonColor = "primary",
}: DropdownActionElementProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (value: string) => {
    onSelect(value);
    handleClose();
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        width: "100%",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        position: "relative",
      }}
    >
      {/* Icon at top */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          padding: 0.5,
        }}
      >
        {icon}
      </Box>

      {/* Title */}
      <Typography variant="body2" align="center">
        {title}
      </Typography>

      {/* Dropdown Button */}
      <Button
        size="small"
        variant={buttonVariant}
        color={buttonColor}
        startIcon={buttonIcon}
        endIcon={<ArrowDropDownRounded />}
        onClick={handleOpen}
        fullWidth
      >
        {buttonText}
      </Button>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};
