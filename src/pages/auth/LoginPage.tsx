import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Apple, Google, Email, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ State for password visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await loginUser(email, password);
      navigate("/dashboard"); // ✅ Redirect after successful login
    } catch (err) {
      setError("Invalid email or password.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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
        {/* ✅ Header */}
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Sign In
        </Typography>
        <Divider>
          <Typography variant="body2">Gradly</Typography>
        </Divider>

        {/* ✅ Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* ✅ Email */}
        <TextField
          fullWidth
          label="Email Address"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* ✅ Password with Visibility Toggle */}
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* ✅ Sign In Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 2,
            background: "linear-gradient(45deg, #6a11cb, #2575fc)",
          }}
          startIcon={<Email />}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Sign in with Email"}
        </Button>

        {/* ✅ OR Continue with */}
        <Typography sx={{ marginY: 2, fontSize: "14px", color: "gray" }}>
          or continue with
        </Typography>

        {/* ✅ Google Sign-In */}
        <Button variant="outlined" fullWidth sx={{ marginBottom: 1 }} startIcon={<Google />}>
          Sign in with Google
        </Button>

        {/* ✅ Apple Sign-In */}
        <Button variant="outlined" fullWidth startIcon={<Apple />}>
          Sign in with Apple
        </Button>

        {/* ✅ Already have an account? */}
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          Don't have an account?{" "}
          <Link to="/auth/register" style={{ color: "#6a11cb", textDecoration: "none" }}>
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
