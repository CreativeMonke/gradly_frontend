import React, { useState, useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  Paper,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Tooltip,
  CircularProgress,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import {
  AutoAwesome,
  DashboardRounded,
  DeleteRounded,
  EditRounded,
  BookRounded,
  AddBoxRounded,
  OpenInNewRounded,
} from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate, Link as RouterLink, useParams } from "react-router-dom";
import {
  getSubject,
  //getAvailableChapters,
  generateSubjectDescription,
  updateSubject,
  deleteSubject,
} from "../../services/subjectsService";
//import { SearchElement } from "../../components/Elements/SearchElement";
import { ActionElement } from "../../components/Elements/ActionElement";
import { deleteChapter, getChapters } from "../../services/chaptersService";
import { ConfirmDialog } from "../../components/Elements/ConfirmDialog";
import { showErrorToast } from "../../utils/toast";

const CATEGORIES = [
  "math-computer-science",
  "natural-sciences",
  "philology",
  "social-sciences",
  "technical-sciences",
  "natural-resources-environment",
  "economic-sciences",
  "arts",
  "sports",
  "pedagogy",
];

const SubjectPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>() || "";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    subjectCategory: "",
    isMarketplaceVisible: false,
    isTemplate: false,
    chapters: [],
  });

  const [subjectChapters, setSubjectChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteChapterDialogOpen, setDeleteChapterDialogOpen] = useState({
    id: "",
    name: "",
  });
  // ✅ Fetch Subject Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const subjectData = await getSubject(subjectId ?? "");
        //const chaptersData = await getAvailableChapters();
        const chaptersData = await getChapters({ subjectId: subjectId });
        setForm(subjectData);
        setSubjectChapters(chaptersData);
      } catch (err) {
        //with a new line in between
        setError(`Failed to load subject data.\n ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectId]);

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

    setSaving(true);
    try {
      const description = await generateSubjectDescription(
        form.name,
        form.subjectCategory
      );
      if (description) {
        setForm((prev) => ({ ...prev, description }));
      }
    } catch (err) {
      setError(`Failed to generate description. ${err}`);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Handle Save
  const handleSave = async () => {
    if (!form.name || !form.subjectCategory) {
      setError("Name and category are required.");
      return;
    }

    setSaving(true);
    try {
      await updateSubject(subjectId ?? "", form);
      navigate("/subjects");
    } catch (error) {
      setError(`Failed to update subject. ${error}`);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Handle Delete
  const handleDeleteSubject = async () => {
    setDeleting(true);
    try {
      await deleteSubject(subjectId ?? "");
      ///.3s delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      navigate("/subjects");
    } catch (error) {
      showErrorToast(`${error}`);
    } finally {
      setDeleting(false);
    }
  };
  async function handleDeleteChapter(chapterId: string) {
    setDeleting(true);
    try {
      await deleteChapter(chapterId);
      ///.3s delay
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      showErrorToast(`${error}`);
    } finally {
      setDeleting(false);
    }
  }
  // ✅ Breadcrumbs
  const breadcrumbs = [
    <Link
      key="1"
      component={RouterLink}
      to="/dashboard"
      underline="hover"
      color="inherit"
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <DashboardRounded /> Dashboard
    </Link>,
    <Link
      key="2"
      component={RouterLink}
      to="/subjects"
      underline="hover"
      color="inherit"
    >
      Subjects
    </Link>,
    <Typography key="3" color="text.primary">
      {form.name}
    </Typography>,
  ];

  // ✅ Chapter DataGrid Columns
  const chapterColumns: GridColDef[] = [
    { field: "title", headerName: "Chapter Name", width: 200 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      align: "center",
      resizable: false,
      headerAlign: "center",
      renderCell: (params) => {
        const handleDelete = () => {
          setDeleteChapterDialogOpen({
            id: params.row._id,
            name: params.row.title,
          });
        };

        const handleOpen = () => {
          // Implement open logic here
          console.log(`Opening chapter with ID: ${params.row._id}`);
          window.open(`/chapters/${params.row._id}`, "_blank");
        };

        return (
          <>
            {/* Open Button */}
            <Tooltip title="Open Chapter">
              <IconButton onClick={handleOpen} size="small">
                <OpenInNewRounded />
              </IconButton>
            </Tooltip>

            {/* Delete Button */}
            <Tooltip title="Delete Chapter">
              <IconButton onClick={handleDelete} size="small" color="error">
                <DeleteRounded />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  if (loading)
    return (
      <Paper
        sx={{
          height: "100dvh",
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Paper>
    );
  if (error)
    return (
      <Paper
        sx={{
          height: "100dvh",
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="error" variant="h3">
          {error}
        </Typography>
      </Paper>
    );

  return (
    <Box sx={{ padding: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      {/* ✅ Page Header */}
      <Paper
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
        <Typography variant="h4">{form.name}</Typography>
      </Paper>
      <Paper
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          borderRadius: 3,
          ///Transparent background
          backgroundColor: "transparent",
        }}
      >
        {/* ✅ Editable Form */}
        <TextField
          fullWidth
          label="Subject Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          select
          label="Category"
          name="subjectCategory"
          value={form.subjectCategory}
          onChange={handleChange}
        >
          {CATEGORIES.map((category) => (
            <MenuItem key={category} value={category}>
              {category.charAt(0).toUpperCase() +
                category.slice(1).replace("-", " ")}
            </MenuItem>
          ))}
        </TextField>

        {/* ✅ Description with AI */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Generate with AI">
                    <IconButton
                      onClick={handleGenerateDescription}
                      disabled={saving}
                    >
                      {saving ? (
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

        {/* ✅ DataGrids */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h6">Linked Chapters</Typography>
            <Tooltip title="Open chapters overview">
              <IconButton
                color="info"
                onClick={() => navigate(`/subjects/${subjectId}/chapters`)}
              >
                <OpenInNewRounded />
              </IconButton>
            </Tooltip>
          </Box>
          <Button
            variant="contained"
            color="success"
            endIcon={<AddBoxRounded />}
            onClick={() => navigate(`/subjects/${subjectId}/chapters/new`)}
          >
            Create Chapter
          </Button>
        </Box>
        <DataGrid
          getRowId={(row) => row._id}
          rows={subjectChapters}
          columns={chapterColumns}
        />
        {/* ✅ Action Buttons */}
        <ActionElement
          icon={<BookRounded />}
          title="Manage Subject"
          button1Text="Save Changes"
          button1Icon={<EditRounded />}
          onButton1Click={handleSave}
          button1Variant="contained"
          button1Color="primary"
          button1Loading={saving}
          button2Text="Delete Subject"
          button2Icon={<DeleteRounded />}
          onButton2Click={() => setDeleteDialogOpen(true)} // Open dialog
          button2Variant="outlined"
          button2Color="error"
        />
      </Paper>
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteSubject}
        title="Confirm Deletion"
        description="Are you sure you want to delete this subject and all it's associated chapters? This action cannot be undone."
        confirmText="Delete"
        loading={deleting}
        icon={<DeleteRounded color="error" />}
      />
      <ConfirmDialog
        open={deleteChapterDialogOpen.id ? true : false}
        onClose={() => setDeleteChapterDialogOpen({ id: "", name: "" })}
        onConfirm={() => handleDeleteChapter(deleteChapterDialogOpen.id)}
        title="Confirm Deletion"
        richDescription={
          <Typography variant="body2" sx={{ mt: 1 }}>
            Are you sure you want to delete the chapter{" "}
            <Typography component="span" color="warning">
              {deleteChapterDialogOpen.name}
            </Typography>
            ? This action cannot be undone.
          </Typography>
        }
        confirmText="Delete"
        loading={deleting}
        icon={<DeleteRounded color="error" />}
      />
    </Box>
  );
};

export default SubjectPage;
