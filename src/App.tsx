import { Container } from "@mui/material";
import AppRoutes from "./routes";

const App = () => {
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: "100dvh",
        width: "100dvw",
      }}
    >
      <AppRoutes />
    </Container>
  );
};

export default App;
