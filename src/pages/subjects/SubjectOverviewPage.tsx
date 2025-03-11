import {
  AddRounded,
  BookRounded,
  DashboardRounded,
  GradingRounded,
  GridOffRounded,
  StorefrontRounded,
  SubjectRounded,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Grid2,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { useLocation, Link as RouterLink, useNavigate } from "react-router-dom";
import { SingleElement } from "../../components/Elements/SingleElement";
import { ActionElement } from "../../components/Elements/ActionElement";
import { SearchElement } from "../../components/Elements/SearchElement";
import { SubjectsGrid } from "./SubjectsGrid";
import { useSubjectsStore } from "../../store/subjectsStore";
import { useChaptersStore } from "../../store/chaptersStore";
import { useEffect, useRef, useState } from "react";

export function SubjectOverviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    subjects,
    fetchSubjects,
    error: subjectError,
  } = useSubjectsStore();
  const {
    chapters,
    fetchChapters,
    error: chapterError,
  } = useChaptersStore();

  const [loading, setLoading] = useState(true);
  const hasFetchedChapters = useRef(false); // ✅ Cache to avoid redundant fetching

  console.log(subjects, "subjects");

  // ✅ Fetch subjects only if empty
  useEffect(() => {
    if (subjects.length === 0) {
      console.log("Fetching subjects...");
      fetchSubjects("").finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [subjects, fetchSubjects]);

  // ✅ Fetch chapters only when subjects are loaded AND chapters are empty
  useEffect(() => {
    if (subjects.length > 0 && !hasFetchedChapters.current) {
      console.log("Fetching chapters for subject:", subjects[0]._id);
      fetchChapters({ subjectId: subjects[0]._id });
      hasFetchedChapters.current = true; // ✅ Avoid multiple reloads
    }
  }, [subjects, fetchChapters]);

  const numberOfSubjects = subjects.length;
  const completedChapters = chapters.filter(
    (chapter) => chapter.isCompleted
  ).length;
  const unCompletedChapters = chapters.filter(
    (chapter) => !chapter.isCompleted
  ).length;

  const pathnames = location.pathname.split("/").filter((x) => x);
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
    ...pathnames.map((value, index) => {
      const last = index === pathnames.length - 1;
      const to = `/${pathnames.slice(0, index + 1).join("/")}`;

      return last ? (
        <Typography key={to} color="text.primary">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Typography>
      ) : (
        <Link
          key={to}
          component={RouterLink}
          to={to}
          underline="hover"
          color="inherit"
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Link>
      );
    }),
  ];

  const handleCreateSubject = () => {
    navigate("/subjects/create-subject");
  };

  const handleOpenSubjectMarketplace = () => {
    console.log("Open Subject Marketplace");
  };

  const handleSearch = (value: string) => {
    console.log("Search value:", value);
  };

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
          backgroundColor: "transparent",
        }}
      >
        <CircularProgress />
      </Paper>
    );
  if (subjectError || chapterError)
    return (
      <Paper
        sx={{
          height: "100dvh",
          backgroundColor: "transparent",
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="error" variant="h3">
          {subjectError || chapterError}
        </Typography>
      </Paper>
    );

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        p: 3,
        gap: 2,
      }}
    >
      {/* ✅ Page Header */}
      <Paper
        variant="elevation"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
        <Typography variant="h4">Subjects - Overview</Typography>
      </Paper>

      {/* ✅ Stats Section */}
      <Grid2
        container
        spacing={2}
        rowGap={2}
        columns={{ xs: 4, sm: 6, md: 9, lg: 12, xl: 15 }}
        sx={{
          width: "100%",
        }}
      >
        <Grid2 size={{ xs: 4, sm: 2, md: 3, lg: 4, xl: 5 }}>
          <SingleElement
            icon={<SubjectRounded />}
            title="Total Subjects"
            value={numberOfSubjects}
          />
        </Grid2>
        <Grid2 size={{ xs: 4, sm: 2, md: 3, lg: 4, xl: 5 }}>
          <SingleElement
            icon={<GradingRounded />}
            title="Learned Chapters"
            value={completedChapters}
            textColor="success"
          />
        </Grid2>
        <Grid2 size={{ xs: 4, sm: 2, md: 3, lg: 4, xl: 5 }}>
          <SingleElement
            icon={<GridOffRounded />}
            title="Unlearned Chapters"
            value={unCompletedChapters}
            textColor="warning"
          />
        </Grid2>

        {/* ✅ Search */}
        <Grid2 size={{ xs: 4, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <SearchElement
            onSearch={handleSearch}
            placeholder="Search Subjects..."
          />
        </Grid2>

        {/* ✅ Action Buttons */}
        <Grid2 size={{ xs: 4, sm: 3, md: 6, lg: 6, xl: 9 }}>
          <ActionElement
            icon={<BookRounded sx={{ color: "#c28cf3", fontSize: 24 }} />}
            title="Manage Subjects"
            button1Text="Create Subject"
            button1Icon={<AddRounded />}
            onButton1Click={handleCreateSubject}
            button1Variant="contained"
            button1Color="success"
            button2Text="Subject Marketplace"
            button2Icon={<StorefrontRounded />}
            onButton2Click={handleOpenSubjectMarketplace}
            button2Variant="outlined"
            button2Color="secondary"
          />
        </Grid2>

        {/* ✅ Subjects Grid */}
        <Grid2 size={15}>
          <SubjectsGrid />
        </Grid2>
      </Grid2>
    </Box>
  );
}
