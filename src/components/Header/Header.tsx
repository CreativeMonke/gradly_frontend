import { Box, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface HeaderProps {
  onToggleMobile: () => void;
}

export default function Header({ onToggleMobile }: HeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
        px: 2,
      }}
    >
      <IconButton onClick={onToggleMobile} sx={{ color: "white" }}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h5" color="info">
        Gradly
      </Typography>
    </Box>
  );
}
