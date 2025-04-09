import {
  Box,
  Typography,
  CircularProgress,
  Breadcrumbs,
  Tabs,
  Tab,
  IconButton,
  styled,
  useTheme,
  Theme,
  CSSObject,
  Paper,
  Link,
  Button,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Chapter, useChaptersStore } from "../../../store/chaptersStore";
import { MarkdownAIActionMenu } from "../../../components/Elements/Utility/MarkdownEditor/MarkdownAIActionMenu";
import MarkdownEditor from "../../../components/Elements/Utility/MarkdownEditor/MarkdownEditor";
import { MaterialsSection } from "../../../components/Elements/Utility/MaterialsSection";
import { DashboardRounded, DescriptionRounded } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { useSubjectsStore } from "../../../store/subjectsStore";

const DEFAULT_DRAWER_WIDTH = 320;

const openedMixin = (theme: Theme, width: number): CSSObject => ({
  width,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: 0,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "drawerWidth",
})<{
  open?: boolean;
  drawerWidth: number;
}>(({ theme, open, drawerWidth }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme, drawerWidth),
    "& .MuiDrawer-paper": openedMixin(theme, drawerWidth),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function ChapterPage() {
  const { chapterId, subjectId } = useParams<{
    chapterId: string;
    subjectId: string;
  }>();
  const { chapters, fetchChapters } = useChaptersStore();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [lastSavedContent, setLastSavedContent] = useState("");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filesDrawerOpen, setFilesDrawerOpen] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState(DEFAULT_DRAWER_WIDTH);
  const theme = useTheme();

  const { subjects, fetchSubjects } = useSubjectsStore();
  const [subjectName, setSubjectName] = useState<string>("Loading...");
  useEffect(() => {
    const existingSubject = subjects.find((s) => s._id === subjectId);
    if (existingSubject) {
      setSubjectName(existingSubject.name);
    } else {
      const fetch = async () => {
        await fetchSubjects("");
        const updated = useSubjectsStore
          .getState()
          .subjects.find((s) => s._id === subjectId);

        if (updated) setSubjectName(updated.name);
      };
      fetch();
    }
  }, [subjectId, subjects, fetchSubjects]);

  useEffect(() => {
    const existing = chapters.find((c) => c._id === chapterId);
    if (existing) {
      setChapter(existing);
      setMarkdownContent(existing.markdownContent ?? "");
      setLastSavedContent(existing.markdownContent ?? "");
      setLoading(false);
    } else {
      const fetch = async () => {
        setLoading(true);
        await fetchChapters({ subjectId: subjectId });
        const updated = useChaptersStore
          .getState()
          .chapters.find((c) => c._id === chapterId);

        if (updated) {
          setChapter(updated);
          setMarkdownContent(updated.markdownContent ?? "");
          setLastSavedContent(updated.markdownContent ?? "");
        }
        setLoading(false);
      };
      fetch();
    }
  }, [chapterId, chapters, fetchChapters, subjectId]);
  const saveMarkdown = useCallback(async () => {
    if (!chapter || markdownContent === lastSavedContent) return;
    try {
      setSaveStatus("saving");
      const data: FormData = new FormData();
      data.append("markdownContent", markdownContent);
      await useChaptersStore
        .getState()
        .updateExistingChapter(chapter._id, data, true);
      useChaptersStore.setState((prev) => ({
        chapters: prev.chapters.map((c) =>
          c._id === chapter._id ? { ...c, markdownContent } : c
        ),
      }));
      setLastSavedContent(markdownContent);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error("Failed to save:", err);
      setSaveStatus("error");
    }
  }, [chapter, markdownContent, lastSavedContent]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (markdownContent !== lastSavedContent) saveMarkdown();
    }, 15000);
    return () => clearTimeout(timeout);
  }, [saveMarkdown, markdownContent, lastSavedContent]);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveMarkdown();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [saveMarkdown]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleRunAI = (action: "structure" | "edit", prompt: string) => {
    if (action === "structure") {
      setMarkdownContent((prev) => `${prev}\n\n## AI Structure\n${prompt}`);
    } else {
      alert("Edit selected text coming soon");
    }
  };

  if (loading || !chapter) return <CircularProgress />;

  return (
    <Box sx={{ display: "flex" }}>
      {/* Main Content */}
      <Box flex={1} p={4}>
        <Paper
          variant="elevation"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            mb: 2,
          }}
        >
          <Breadcrumbs>
            <Link
              key="1"
              component={RouterLink}
              to="/dashboard"
              underline="hover"
              color="inherit"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <DashboardRounded />
              Dashboard
            </Link>
            <Link
              key="1"
              component={RouterLink}
              to="/subjects"
              underline="hover"
              color="inherit"
            >
              Subjects
            </Link>
            <Link
              key="2"
              component={RouterLink}
              to={`/subjects/${subjectId}/chapters`}
              underline="hover"
              color="inherit"
            >
              {subjectName}
            </Link>
            <Typography key="3" color="text.primary">
              {chapter.title}
            </Typography>
          </Breadcrumbs>

          <Typography variant="h4">{chapter.title}</Typography>
        </Paper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Content" />
            <Tab disabled label="AI Tools" />
            <Tab disabled label="Notes" />
          </Tabs>
          <Box>
            <MarkdownAIActionMenu onRun={handleRunAI} loading={false} />
            <IconButton onClick={() => setFilesDrawerOpen(!filesDrawerOpen)}>
              <DescriptionRounded />
            </IconButton>
          </Box>
        </Box>
        {tabIndex === 0 && (
          <Box sx={{}}>
            <MarkdownEditor
              value={markdownContent}
              color={
                saveStatus === "error"
                  ? "warning"
                  : saveStatus === "saved"
                  ? "info"
                  : markdownContent === lastSavedContent
                  ? "info"
                  : "warning"
              }
              onChange={setMarkdownContent}
            />
            <Paper
              variant="outlined"
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                p: 1.5,
                gap: 1.5,
              }}
            >
              <Typography
                variant="body2"
                color={
                  saveStatus === "error"
                    ? "error"
                    : saveStatus === "saved"
                    ? "success"
                    : markdownContent === lastSavedContent
                    ? "success"
                    : "error"
                }
              >
                {saveStatus === "saving"
                  ? "Saving..."
                  : saveStatus === "saved"
                  ? "Saved ✓"
                  : saveStatus === "error"
                  ? "Error ❌"
                  : markdownContent === lastSavedContent
                  ? "Saved ✓"
                  : "Not saved ❌"}
              </Typography>
              <Button
                onClick={saveMarkdown}
                variant="contained"
                size="small"
                loading={saveStatus === "saving"}
                disabled={markdownContent === lastSavedContent}
              >
                Save
              </Button>
            </Paper>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <Typography variant="body1">
              AI tools like summary, flashcards coming soon...
            </Typography>
          </Box>
        )}

        {tabIndex === 2 && (
          <Box>
            <Typography variant="body1">
              User notes area (editable + auto-save) coming soon...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Resizer */}
      <Box
        sx={{
          width: "4px",
          height: "100vh",
          cursor: "ew-resize",
          backgroundColor: "#f3f3f3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
          "&:hover": {
            backgroundColor: "#ccc",
          },
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          const startX = e.clientX;
          const startWidth = drawerWidth;

          // Disable text selection during drag
          const body = document.body;
          const originalUserSelect = body.style.userSelect;
          body.style.userSelect = "none";

          const onMouseMove = (moveEvent: MouseEvent) => {
            requestAnimationFrame(() => {
              const delta = moveEvent.clientX - startX;
              const newWidth = Math.min(Math.max(startWidth - delta, 260), 800);
              setDrawerWidth(newWidth);
            });
          };

          const onMouseUp = () => {
            body.style.userSelect = originalUserSelect;
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
          };

          window.addEventListener("mousemove", onMouseMove);
          window.addEventListener("mouseup", onMouseUp);
        }}
      />

      {/* Right Drawer */}

      <Drawer
        variant="permanent"
        anchor="right"
        open={filesDrawerOpen}
        drawerWidth={drawerWidth}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Typography variant="h6">Materials</Typography>
          <IconButton onClick={() => setFilesDrawerOpen(false)}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </Box>

        {filesDrawerOpen && (
          <MaterialsSection
            chapter={chapter}
            materials={chapter?.materials ?? []}
            chapterId={chapterId!}
          />
        )}
      </Drawer>
    </Box>
  );
}
