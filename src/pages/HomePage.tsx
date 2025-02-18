import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import backgroundImagePath from "../../public/assests/images/home-background.jpg";

const HomePage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        textAlign: "center",
        padding: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${backgroundImagePath})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px)",
          zIndex: -1,
        }}
      />

      <Typography
        variant="h4"
        sx={{
          color: "white",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: 2,
        }}
      >
        Bine ai venit la Gradly
      </Typography>

      <Typography
        variant="h2"
        sx={{ fontWeight: "bold", color: "white", marginBottom: 3 }}
      >
        Platforma ideală pentru Bacalaureat
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "white",
            transition: "transform 0.3s ease-in-out",
            "&:hover": { transform: "scale(1.1)" },
          }}
          component={Link}
          to="/auth/login"
          startIcon={<LoginIcon />}
        >
          Autentificare
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "white",
            transition: "transform 0.3s ease-in-out",
            "&:hover": { transform: "scale(1.1)" },
          }}
          component={Link}
          to="/auth/register"
          startIcon={<PersonAddIcon />}
        >
          Înregistrare
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
