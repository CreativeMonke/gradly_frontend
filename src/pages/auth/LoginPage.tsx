import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { Apple, Google, Email } from "@mui/icons-material";

const LoginPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "450px",
          padding: "2rem",
          textAlign: "center",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Sign In
        </Typography>
        <Divider>
          <Typography variant="body2">Gradly</Typography>{" "}
        </Divider>

        <TextField
          fullWidth
          label="Email Address"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 2,
            background: "linear-gradient(45deg, #6a11cb, #2575fc)",
          }}
          startIcon={<Email />}
        >
          Sign in with Email
        </Button>

        <Typography sx={{ marginY: 2, fontSize: "14px", color: "gray" }}>
          or continue with
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 1 }}
          startIcon={<Google />}
        >
          Sign in with Google
        </Button>

        <Button variant="outlined" fullWidth startIcon={<Apple />}>
          Sign in with Apple
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
