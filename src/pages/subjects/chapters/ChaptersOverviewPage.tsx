import {
  AddRounded,
  CheckCircleRounded,
  DashboardRounded,
  FilterAltRounded,
  LibraryBooksRounded,
  PendingActionsRounded,
  SortRounded,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Grid2,
  LinearProgress,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { SingleElement } from "../../../components/Elements/SingleElement";
import { SearchElement } from "../../../components/Elements/SearchElement";
import { ChaptersGrid } from "./ChaptersGrid";
import { Subject, useSubjectsStore } from "../../../store/subjectsStore";
import { useChaptersStore } from "../../../store/chaptersStore";
import { useEffect, useState } from "react";
import { getSubject } from "../../../services/subjectsService";
import { MinimalDropdownActionElement } from "../../../components/Elements/MinimalDropdownActionElement";
import { MinimalActionElement } from "../../../components/Elements/Minimal Elements/MinimalActionElement";

const sortOptions = [
  { label: "Title", value: "title" },
  { label: "Progress", value: "progress" },
  { label: "Completion Date", value: "completionDate" },
];

// ✅ Filter Options
const filterOptions = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "In Progress", value: "in-progress" },
  { label: "To Learn", value: "to-learn" },
];

async function subjectCheck(subjectId: string, subjects: Subject[]) {
  if (!subjectId) {
    try {
      const subject = await getSubject(subjectId);
      return subject;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  } else {
    const subject = subjects.find(
      (subject: Subject) => subject._id === subjectId
    );
    return subject;
  }
}

export function ChaptersOverviewPage() {
  const navigate = useNavigate();
  const { subjects, fetchSubjects } = useSubjectsStore();
  const { chapters, setSort, setFilter, setSearch, sortBy, filterBy } =
    useChaptersStore();
  const { subjectId } = useParams<{ subjectId: string }>();

  // ✅ Use state to store the current subject
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);

  useEffect(() => {
    if (subjects.length === 0) {
      fetchSubjects("");
    }
  }, [subjects, fetchSubjects]);

  // ✅ Load the current subject using useEffect
  useEffect(() => {
    const loadSubject = async () => {
      if (subjectId) {
        const subject = await subjectCheck(subjectId, subjects);
        setCurrentSubject(subject || null);
      }
    };

    loadSubject();
  }, [subjectId, subjects]);

  // ✅ Render only after currentSubject is loaded
  if (!currentSubject) return <div>Loading...</div>;

  const numberOfChapters = currentSubject.chapters?.length || 0;
  const completedChapters = chapters.filter(
    (chapter) => chapter.isCompleted
  ).length;
  const unCompletedChapters = chapters.filter(
    (chapter) => !chapter.isCompleted
  ).length;
  const progressPercentage = numberOfChapters
    ? Math.round((completedChapters / numberOfChapters) * 100)
    : 0;

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
    >
      Subjects
    </Link>,
    <Typography key="3" color="text.primary">
      {currentSubject.name}
    </Typography>,
  ];

  const handleCreateChapter = () => {
    navigate("/subjects/" + subjectId + "/create-chapter");
  };

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
      {/* Page header */}
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
        <Typography variant="h4">Chapters</Typography>
      </Paper>
      <Grid2
        container
        spacing={2}
        rowGap={2}
        columns={{ xs: 4, sm: 6, md: 9, lg: 12, xl: 15 }}
        sx={{
          width: "100%",
        }}
      >
        <Grid2 size={15}>
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              height: "100%",
              p: 2,
              borderRadius: 3,
            }}
          >
            <Typography variant="body2">Progress:</Typography>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2">{progressPercentage}%</Typography>
          </Paper>
        </Grid2>
        <Grid2 size={{ xs: 4, sm: 2, md: 3, lg: 4, xl: 5 }}>
          <SingleElement
            icon={<LibraryBooksRounded />}
            title="Total Chapters"
            value={numberOfChapters}
          />
        </Grid2>
        <Grid2 size={{ xs: 4, sm: 2, md: 3, lg: 4, xl: 5 }}>
          <SingleElement
            icon={<CheckCircleRounded />}
            title="Learned Chapters"
            value={completedChapters}
            textColor="success"
          />
        </Grid2>
        <Grid2 size={{ xs: 4, sm: 2, md: 3, lg: 4, xl: 5 }}>
          <SingleElement
            icon={<PendingActionsRounded />}
            title="Remaining Chapters"
            value={unCompletedChapters}
            textColor="warning"
          />
        </Grid2>
        <Grid2 size={15}>
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              height: "100%",
              p: 2,
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                width: "50%",
                mr: "auto",
              }}
            >
              <SearchElement
                onSearch={setSearch}
                enableMobileDrawer
                placeholder="Search Chapter..."
              />
            </Box>
            <MinimalDropdownActionElement
              icon={<SortRounded />}
              buttonText={
                sortBy
                  ? sortOptions.find((o) => o.value === sortBy)?.label ??
                    "Sort by..."
                  : "Sort by..."
              }
              buttonVariant="contained"
              options={sortOptions}
              onSelect={(value) => setSort(value)}
            />
            <MinimalDropdownActionElement
              icon={<FilterAltRounded />}
              buttonText={
                filterBy
                  ? filterOptions.find((o) => o.value === filterBy)?.label ??
                    "Filter by..."
                  : "Filter by..."
              }
              buttonVariant="contained"
              options={filterOptions}
              onSelect={(value) => setFilter(value)}
            />
            <MinimalActionElement
              icon={<AddRounded />}
              buttonColor="success"
              tooltip="Create Chapter"
              onClick={handleCreateChapter}
            />
          </Paper>
        </Grid2>
        <Grid2 size={15} sx={{}}>
          <ChaptersGrid />
        </Grid2>
      </Grid2>
    </Box>
  );
}
