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
import {
  Apple,
  Google,
  Email,
  Visibility,
  VisibilityOff,
  ArrowBack,
} from "@mui/icons-material";
import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Link } from "react-router-dom";
const RegisterPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Step 1 = Initial Form, Step 2 = Details Form
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    birthdate: dayjs() as dayjs.Dayjs | null, // ✅ Allow null value
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "", repeatPassword: "" };

    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }

    if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Include at least one uppercase letter";
      valid = false;
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Include at least one number";
      valid = false;
    } else if (!/[^A-Za-z0-9]/.test(form.password)) {
      newErrors.password = "Include at least one special character";
      valid = false;
    }

    if (form.repeatPassword !== form.password) {
      newErrors.repeatPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (step == 2)
      if (!form.birthdate) {
        console.error("Birthdate is required");
        return;
      }
    if (step === 1) {
      if (validateForm()) {
        setStep(2); // ✅ Swipe to the next form on valid submission
      }
    } else {
      try {
        const result = await registerUser(
          form.firstName,
          form.lastName,
          form.email,
          form.password,
          form.birthdate.toISOString() // ✅ Convert dayjs object to string
        );
        if (result) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Registration failed", error);
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* ✅ Step transition handled by Framer Motion */}
          <AnimatePresence mode="wait">
            {/* ✅ Step 1: Initial Form */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  duration: 0.5,
                }}
              >
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  Register
                </Typography>
                <Divider>
                  <Typography variant="body2">Gradly</Typography>
                </Divider>

                {/* Email */}
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

                {/* Password */}
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  error={!!errors.password}
                  helperText={errors.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Repeat Password */}
                <TextField
                  fullWidth
                  label="Repeat Password"
                  variant="outlined"
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  value={form.repeatPassword}
                  error={!!errors.repeatPassword}
                  helperText={errors.repeatPassword}
                  onChange={(e) =>
                    setForm({ ...form, repeatPassword: e.target.value })
                  }
                />

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ marginTop: 2 }}
                  onClick={handleRegister}
                  startIcon={<Email />}
                >
                  Sign up with Email
                </Button>
              </motion.div>
            )}

            {/* ✅ Step 2: Additional Details */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                  }}
                  onClick={() => setStep(1)}
                >
                  <ArrowBack />
                </IconButton>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Additional Details
                </Typography>

                {/* First Name */}
                <TextField
                  fullWidth
                  label="First Name"
                  margin="normal"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />

                {/* Last Name */}
                <TextField
                  fullWidth
                  label="Last Name"
                  margin="normal"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />

                {/* Birthdate */}
                <DatePicker
                  label="Birthdate"
                  value={form.birthdate}
                  onChange={(date) =>
                    setForm({ ...form, birthdate: date ?? null })
                  } // ✅ Handle null case
                  sx={{ width: "100%", mt: 2, borderRadius: 12 }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ marginTop: 2 }}
                  onClick={handleRegister}
                >
                  Complete Registration
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ✅ Static Social Buttons */}
          <Divider sx={{ marginY: 2 }} />
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Google />}
            sx={{ marginBottom: 1 }}
          >
            Sign up with Google
          </Button>
          <Button variant="outlined" fullWidth startIcon={<Apple />}>
            Sign up with Apple
          </Button>
           {/* ✅ Already have an account */}
           <Typography sx={{ textAlign: "center", mt: 2 }}>
              Already have an account?{" "}
              <Link to="/auth/login" style={{ color: "#6a11cb", textDecoration: "none" }}>
                Log in
              </Link>
            </Typography>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default RegisterPage;
