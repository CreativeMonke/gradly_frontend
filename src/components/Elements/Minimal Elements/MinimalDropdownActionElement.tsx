import { useState, ReactNode } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ButtonProps,
} from "@mui/material";
import { ArrowDropDownRounded } from "@mui/icons-material";

interface MinimalDropdownActionElementProps {
  icon: ReactNode;
  buttonText: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  buttonVariant?: ButtonProps["variant"];
  buttonColor?: ButtonProps["color"];
}

export const MinimalDropdownActionElement = ({
  icon,
  buttonText,
  options,
  onSelect,
  buttonVariant = "text",
  buttonColor = "inherit",
}: MinimalDropdownActionElementProps) => {
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
    <>
      <Button
        size="small"
        variant={buttonVariant}
        color={buttonColor}
        startIcon={icon}
        endIcon={<ArrowDropDownRounded />}
        onClick={handleOpen}
        sx={{
          fontSize: 14,
          borderRadius: 2,
          padding: "4px 8px",
          minWidth: "max-content",
          width: "100px",
          textTransform: "none", // Avoid uppercase
        }}
      >
        {buttonText}
      </Button>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
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
    </>
  );
};
