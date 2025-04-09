import { ReactNode } from "react";
import { Paper, Typography, Box, Button, ButtonProps, CircularProgress } from "@mui/material";

interface ActionElementProps {
  icon: ReactNode;
  title: string;

  // Button 1 props (required)
  button1Text: string;
  button1Icon: ReactNode;
  onButton1Click: () => void;
  button1Variant?: ButtonProps["variant"];
  button1Color?: ButtonProps["color"];
  button1Loading?: boolean;

  // Button 2 props (optional)
  button2Text?: string;
  button2Icon?: ReactNode;
  onButton2Click?: () => void;
  button2Variant?: ButtonProps["variant"];
  button2Color?: ButtonProps["color"];
  button2Loading?: boolean;
}

export const ActionElement = ({
  icon,
  title,
  button1Text,
  button1Icon,
  onButton1Click,
  button1Variant = "contained",
  button1Color = "primary",
  button1Loading = false,
  button2Text,
  button2Icon,
  onButton2Click,
  button2Variant = "outlined",
  button2Color = "secondary",
  button2Loading = false,
}: ActionElementProps) => {
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

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        {/* Button 1 */}
        <Button
          size="small"
          variant={button1Variant}
          color={button1Color}
          startIcon={!button1Loading ? button1Icon : undefined}
          onClick={onButton1Click}
          disabled={button1Loading}
          sx={{
            fontSize: 14,
            borderRadius: 2,
            minWidth: 100,
          }}
        >
          {button1Loading ? <CircularProgress size={16} color="inherit" /> : button1Text}
        </Button>

        {/* Button 2 (Optional) */}
        {button2Text && onButton2Click && (
          <Button
            size="small"
            variant={button2Variant}
            color={button2Color}
            startIcon={!button2Loading ? button2Icon : undefined}
            onClick={onButton2Click}
            disabled={button2Loading}
            sx={{
              fontSize: 14,
              borderRadius: 2,
              minWidth: 100,
            }}
          >
            {button2Loading ? <CircularProgress size={16} color="inherit" /> : button2Text}
          </Button>
        )}
      </Box>
    </Paper>
  );
};
