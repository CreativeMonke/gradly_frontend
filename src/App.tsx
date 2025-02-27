import { Box, Container } from "@mui/material";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import ParticlesBackground from "./background/ParticlesBackground ";

const App = () => {
  return (
    <div>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: -1,
        }}
      >
        <ParticlesBackground />
      </Box>

      <Container
        disableGutters
        maxWidth={false}
        sx={{
          maxheight: "100dvh",

          maxwidth: "100dvw",
        }}
      >
        <ToastContainer />
        <AppRoutes />
      </Container>
    </div>
  );
};

export default App;
