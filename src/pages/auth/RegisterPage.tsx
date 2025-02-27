import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Apple, Google, Email, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const RegisterPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "", repeatPassword: "" };

    // Email validation
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }

    // Password validation
    if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      valid = false;
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
      valid = false;
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Password must contain at least one number";
      valid = false;
    } else if (!/[^A-Za-z0-9]/.test(form.password)) {
      newErrors.password = "Password must contain at least one special character";
      valid = false;
    }

    // Repeat password validation
    if (form.repeatPassword !== form.password) {
      newErrors.repeatPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = () => {
    if (validateForm()) {
      console.log("Registering user:", form);
      // Proceed with registration (e.g., API call)
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
        padding: "1rem",
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
          Register
        </Typography>
        <Divider>
          <Typography variant="body2">Gradly</Typography>
        </Divider>

        <TextField
          fullWidth
          label="Email Address"
          variant="outlined"
          margin="normal"
          value={form.email}
          error={!!errors.email}
          helperText={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type={showPassword ? "text" : "password"}
          value={form.password}
          error={!!errors.password}
          helperText={errors.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
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

        <TextField
          fullWidth
          label="Repeat Password"
          variant="outlined"
          margin="normal"
          type={showPassword ? "text" : "password"}
          value={form.repeatPassword}
          error={!!errors.repeatPassword}
          helperText={errors.repeatPassword}
          onChange={(e) => setForm({ ...form, repeatPassword: e.target.value })}
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
          onClick={handleRegister}
        >
          Sign in with Email
        </Button>

        <Typography sx={{ marginY: 2, fontSize: "14px", color: "gray" }}>
          or continue with
        </Typography>

        <Button variant="outlined" fullWidth sx={{ marginBottom: 1 }} startIcon={<Google />}>
          Sign in with Google
        </Button>

        <Button variant="outlined" fullWidth startIcon={<Apple />}>
          Sign in with Apple
        </Button>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
