import { useEffect, useState } from "react";
import { Box, Container, Grid2, useMediaQuery, useTheme } from "@mui/material";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import ParticlesBackground from "./background/ParticlesBackground ";
import { useAuthStore } from "./store/authStore";

const App = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // ✅ Get auth state from Zustand
  const { checkSession, isAuthenticated } = useAuthStore();

  const handleToggleMobile = () => setMobileOpen((prev) => !prev);
  const handleCloseMobile = () => setMobileOpen(false);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

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
          maxHeight: "100dvh",
          maxWidth: "100dvw",
        }}
      >
        <ToastContainer />
        <Grid2
          container
          spacing={0}
          gap={0}
          columns={{ xs: 12, md: 12, lg: 16, xl: 20 }}
          sx={{ height: "100dvh" }}
        >
          {/* ✅ Only show header if authenticated */}
          {isAuthenticated && !isDesktop && (
            <Grid2 size={12}>
              <Header onToggleMobile={handleToggleMobile} />
            </Grid2>
          )}

          {/* ✅ Only show sidebar if authenticated */}
          {isAuthenticated && isDesktop && (
            <Grid2 size={{ md: 3 }} maxWidth={300}>
              <Sidebar
                mobileOpen={false}
                onMobileClose={() => {}}
                onToggleMobile={handleToggleMobile}
              />
            </Grid2>
          )}

          {/* ✅ Mobile Sidebar */}
          {isAuthenticated && (
            <Sidebar
              mobileOpen={mobileOpen}
              onMobileClose={handleCloseMobile}
              onToggleMobile={handleToggleMobile}
            />
          )}

          {/* ✅ Main Content */}
          <Grid2 size="grow">
            <AppRoutes />
          </Grid2>
        </Grid2>
      </Container>
    </div>
  );
};

export default App;
