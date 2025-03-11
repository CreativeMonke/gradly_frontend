import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  Tooltip,
  MenuItem,
  Alert,
  Switch,
  FormControlLabel,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  AutoAwesome,
  Save,
  ArrowBack,
  DashboardRounded,
  Storefront,
} from "@mui/icons-material";
import { generateSubjectDescription } from "../../services/subjectsService";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useSubjectsStore } from "../../store/subjectsStore";

const CATEGORIES = [
  "math-computer-science", // Mathematics-Computer Science
  "natural-sciences", // Natural Sciences
  "philology", // Philology
  "social-sciences", // Social Sciences
  "technical-sciences", // Technical Sciences
  "natural-resources-environment", // Natural Resources and Environmental Protection
  "economic-sciences", // Economic Sciences
  "arts", // Arts
  "sports", // Sports
  "pedagogy", // Pedagogy
];
const CreateSubjectPage = () => {
  const navigate = useNavigate();
  const { createSubject } = useSubjectsStore();
  const [form, setForm] = useState({
    name: "",
    description: "",
    subjectCategory: "",
    isMarketplaceVisible: false,
    isTemplate: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Handle Form Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on input
  };

  // ✅ Handle AI Description Generation
  const handleGenerateDescription = async () => {
    if (!form.name || !form.subjectCategory) {
      setError("Name and category are required to generate a description.");
      return;
    }

    setLoading(true);
    try {
      const description = await generateSubjectDescription(
        form.name,
        form.subjectCategory
      );

      if (description) {
        setForm((prev) => ({ ...prev, description }));
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Form Submission
  const handleSubmit = async () => {
    if (!form.name || !form.subjectCategory) {
      setError("Name and category are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createSubject(form);

      if (res != null) {
        navigate("/subjects"); // ✅ Redirect to main page after success
      }
    } catch (error) {
      console.error("Error creating subject:", error);
      setError("Failed to create subject. Please try again.");
    } finally {
      ///wait for .5 s then set loading to false
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false); // ✅ Stop loading after request finishes
    }
  };

  // ✅ Breadcrumbs
  const breadcrumbs = [
    <Link
      key="1"
      component={RouterLink}
      to="/dashboard"
      underline="hover"
      color="inherit"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <DashboardRounded />
      Dashboard
    </Link>,
    <Link
      key="2"
      component={RouterLink}
      to="/subjects"
      underline="hover"
      color="inherit"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      Subjects
    </Link>,
    <Typography key="2" color="primary">
      Create Subject
    </Typography>,
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 5,
          borderRadius: 3,
          position: "relative",
        }}
      >
        {/* ✅ Back Button */}
        <IconButton
          sx={{ position: "absolute", top: 8, left: 8 }}
          onClick={() => navigate(-1)}
        >
          <ArrowBack />
        </IconButton>

        {/* ✅ Breadcrumbs */}
        <Breadcrumbs sx={{ marginBottom: 2 }}>{breadcrumbs}</Breadcrumbs>

        {/* ✅ Header */}
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Create Subject
        </Typography>
        <Divider />

        {/* ✅ Error Message */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* ✅ Name */}
        <TextField
          fullWidth
          label="Subject Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          margin="normal"
        />

        {/* ✅ Subject Category */}
        <TextField
          fullWidth
          select
          label="Category"
          name="subjectCategory"
          value={form.subjectCategory}
          onChange={handleChange}
          margin="normal"
        >
          {CATEGORIES.map((category) => (
            <MenuItem key={category} value={category}>
              {category.replace("-", " ").charAt(0).toUpperCase() +
                category.replace("-", " ").slice(1)}
            </MenuItem>
          ))}
        </TextField>

        {/* ✅ Description with AI Button */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          margin="normal"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Generate with AI">
                    <IconButton
                      onClick={handleGenerateDescription}
                      disabled={!form.name || !form.subjectCategory || loading}
                    >
                      {loading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <AutoAwesome />
                      )}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* ✅ Toggle Switches */}
        <FormControlLabel
          control={
            <Switch
              checked={form.isMarketplaceVisible}
              onChange={() =>
                setForm((prev) => ({
                  ...prev,
                  isMarketplaceVisible: !prev.isMarketplaceVisible,
                }))
              }
            />
          }
          label="Visible in Marketplace"
          sx={{ marginTop: 1 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={form.isTemplate}
              onChange={() =>
                setForm((prev) => ({
                  ...prev,
                  isTemplate: !prev.isTemplate,
                }))
              }
            />
          }
          label="Use as Template"
          sx={{ marginTop: 1 }}
        />

        {/* ✅ Marketplace Button */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Storefront />}
          sx={{ mt: 2 }}
          onClick={() => navigate("/marketplace")}
        >
          Browse Marketplace
        </Button>

        {/* ✅ Submit Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            marginTop: 2,
            background: "linear-gradient(45deg, #6a11cb, #2575fc)",
          }}
          onClick={handleSubmit}
          startIcon={<Save />}
          loading={loading}
          disabled={!form.name || !form.subjectCategory || loading}
        >
          Create Subject
        </Button>
      </Paper>
    </Box>
  );
};

export default CreateSubjectPage;
