import React, { useEffect, useMemo, useState } from "react";
import {
  Paper,
  Grid2,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import {
  AutoAwesomeRounded,
  AutorenewRounded,
  CheckCircleOutlineRounded,
  CheckCircleRounded,
  DeleteRounded,
  EditRounded,
  GridViewRounded,
  HighlightOffRounded,
  MoreVertRounded,
  RestartAltRounded,
  ShareRounded,
  ViewListRounded,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Chapter, useChaptersStore } from "../../../store/chaptersStore";
import { DataGrid, GridColDef, GridValidRowModel } from "@mui/x-data-grid";

export interface ChapterInterface extends GridValidRowModel {
  subjectId: string;
  _id: string;
  title: string;
  description?: string;
  currentProgress: number;
  isCompleted: boolean;
  completionDate?: Date;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.05 },
  },
};

export function ChaptersGrid() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const {
    chapters,
    fetchChapters,
    loading,
    error,
    sortBy,
    filterBy,
    searchBy,
  } = useChaptersStore();
  const { subjectId } = useParams<{ subjectId: string }>();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (subjectId) {
      fetchChapters({ subjectId: subjectId });
    }
  }, [subjectId, fetchChapters]);

  function handleChapterClick(chapter: Chapter) {
    navigate(`/subjects/${subjectId}/chapters/${chapter._id}`);
  }

  function handleActionButtonClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleActionButtonClose() {
    setAnchorEl(null);
  }

  function handleEditChapter(chapter: Chapter) {
    navigate(`/subjects/${subjectId}/chapters/${chapter._id}/edit`);
  }

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    chapter: Chapter
  ) => {
    setSelectedChapter(chapter);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedChapter(null);
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "progress",
      headerName: "Progress",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
          }}
          color={
            params.row.currentProgress > 0
              ? `warning.main`
              : params.row.isCompleted
              ? `success.main`
              : `error.main`
          }
        >
          {params.row.currentProgress > 0
            ? `${params.row.currentProgress}%`
            : params.row.isCompleted
            ? new Date(params.row.completionDate || "").toDateString()
            : "Not learned yet"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      maxWidth: 75,
      sortable: false,
      filterable: false,
      align: "center",
      resizable: false,
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={(e) => handleOpenMenu(e, params.row)}
            size="small"
          >
            <MoreVertRounded />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedChapter?._id === params.row._id}
            onClose={handleCloseMenu}
            onClick={handleCloseMenu}
          >
            <MenuItem
              onClick={() => handleEditChapter(params.row)}
              disableRipple
            >
              <EditRounded sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={() => console.log("Take test")} disableRipple>
              <AutoAwesomeRounded sx={{ mr: 1 }} />
              Take Test
            </MenuItem>
            <MenuItem
              onClick={() => console.log("Mark as completed")}
              disableRipple
            >
              <CheckCircleRounded sx={{ mr: 1 }} />
              Mark as Completed
            </MenuItem>
            <MenuItem
              onClick={() => console.log("Share chapter")}
              disableRipple
            >
              <ShareRounded sx={{ mr: 1 }} />
              Share
            </MenuItem>
            <MenuItem
              onClick={() => console.log("Reset progress")}
              disableRipple
            >
              <RestartAltRounded sx={{ mr: 1 }} color="warning" />
              <Typography color="warning">Reset Progress</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => console.log("Delete chapter")}
              disableRipple
            >
              <DeleteRounded sx={{ mr: 1 }} color="error" />
              <Typography color="error">Delete</Typography>
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  const handleViewModeChange = (newViewMode: "grid" | "table") => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const filteredChapters: ChapterInterface[] = useMemo(() => {
    return chapters
      .map((chapter) => ({
        ...chapter,
        subjectId: chapter.subjectId,
        completionDate: chapter.completionDate
          ? new Date(chapter.completionDate) // ✅ Convert to Date
          : undefined,
      }))
      .filter((chapter) => {
        if (filterBy === "completed") return chapter.isCompleted;
        if (filterBy === "in-progress")
          return chapter.currentProgress > 0 && !chapter.isCompleted;
        if (filterBy === "to-learn")
          return chapter.currentProgress === 0 && !chapter.isCompleted;
        return true;
      })
      .filter((chapter) =>
        chapter.title.toLowerCase().includes(searchBy.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "progress") return b.currentProgress - a.currentProgress;
        return 0;
      });
  }, [chapters, filterBy, searchBy, sortBy]);

  if (loading)
    return (
      <Paper
        sx={{
          height: "40dvh",
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
  if (error)
    return (
      <Paper
        sx={{
          height: "40dvh",
          backgroundColor: "transparent",
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
    <Paper
      sx={{
        p: 3,
        position: "relative",
        borderRadius: 3,
        ///Transparent background
        backgroundColor: "transparent",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Chapters
      </Typography>
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
        }}
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={() =>
            handleViewModeChange(viewMode?.includes("table") ? "grid" : "table")
          }
          sx={{
            backgroundColor: "action.hover",
            borderRadius: 2,
            "& .MuiToggleButton-root": {
              color: "text.secondary",
              border: "none",
              "&.Mui-selected": {
                backgroundColor: "action.selected",
                color: "text.primary",
              },
            },
          }}
        >
          <ToggleButton value="table">
            <ViewListRounded fontSize="small" />
          </ToggleButton>
          <ToggleButton value="grid">
            <GridViewRounded fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {viewMode === "grid" ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
        >
          <Grid2 container spacing={2}>
            <AnimatePresence mode="popLayout">
              {filteredChapters.map((chapter) => (
                <Grid2 key={chapter._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    layout
                  >
                    <Paper
                      elevation={12}
                      onClick={() => {
                        handleChapterClick(chapter);
                      }}
                      sx={{
                        minHeight: "25dvh",
                        position: "relative",
                        p: 3,
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        backgroundColor:
                          chapter.currentProgress > 0 &&
                          chapter.currentProgress < 100
                            ? `warning.dark`
                            : chapter.isCompleted
                            ? `success.dark`
                            : `error.dark`,
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                          "& .icon-box": {
                            opacity: 1, // Make icon visible on hover
                          },
                        },
                        cursor: "pointer",
                      }}
                    >
                      {/* Icon at top */}
                      <Box
                        className="icon-box"
                        sx={{
                          position: "absolute",
                          top: 3,
                          left: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          padding: 0.5,
                          opacity: 0, // Hidden by default
                          transition: "opacity 0.2s ease-in-out",
                        }}
                      >
                        {chapter.currentProgress > 0 &&
                        chapter.currentProgress < 100 ? (
                          <AutorenewRounded />
                        ) : chapter.isCompleted ? (
                          <CheckCircleOutlineRounded />
                        ) : (
                          <HighlightOffRounded />
                        )}
                      </Box>
                      {/* Actions menu */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 3,
                          right: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          padding: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(event: React.MouseEvent<HTMLElement>) => {
                            event.stopPropagation(); // ✅ Stop event propagation
                            handleActionButtonClick(event);
                          }}
                        >
                          <MoreVertRounded />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={(event) => {
                            (event as React.MouseEvent).stopPropagation(); // ✅ Cast to MouseEvent
                            handleActionButtonClose();
                          }}
                        >
                          <MenuItem
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                              event.stopPropagation(); // ✅ Stop event propagation
                              handleEditChapter(chapter);
                              handleActionButtonClose();
                            }}
                            disableRipple
                          >
                            <EditRounded sx={{ mr: 1 }} />
                            Edit
                          </MenuItem>
                          <MenuItem
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                              event.stopPropagation();
                              console.log("Take test");
                              handleActionButtonClose();
                            }}
                            disableRipple
                          >
                            <AutoAwesomeRounded sx={{ mr: 1 }} />
                            Take Test
                          </MenuItem>
                          <MenuItem
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                              event.stopPropagation();
                              console.log("Mark as completed");
                              handleActionButtonClose();
                            }}
                            disableRipple
                          >
                            <CheckCircleRounded sx={{ mr: 1 }} />
                            Mark as Completed
                          </MenuItem>
                          <MenuItem
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                              event.stopPropagation();
                              console.log("Share chapter");
                              handleActionButtonClose();
                            }}
                            disableRipple
                          >
                            <ShareRounded sx={{ mr: 1 }} />
                            Share
                          </MenuItem>
                          <MenuItem
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                              event.stopPropagation();
                              console.log("Reset progress");
                              handleActionButtonClose();
                            }}
                            disableRipple
                          >
                            <RestartAltRounded sx={{ mr: 1 }} color="warning" />
                            <Typography color="warning">
                              Reset Progress
                            </Typography>
                          </MenuItem>
                          <MenuItem
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                              event.stopPropagation();
                              console.log("Delete chapter");
                              handleActionButtonClose();
                            }}
                            disableRipple
                          >
                            <DeleteRounded sx={{ mr: 1 }} color="error" />
                            <Typography color="error">Delete</Typography>
                          </MenuItem>
                        </Menu>
                      </Box>

                      {/* Title */}
                      <Typography
                        variant="h6"
                        sx={{
                          textAlign: "center",
                          overflow: "hidden",
                          width: "100%",
                        }}
                      >
                        {chapter.title}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          textAlign: "center",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "100%",
                          maxHeight: "4em",
                        }}
                      >
                        {chapter.description || "No description available"}
                      </Typography>

                      {/* Category */}
                      <Typography
                        variant="caption"
                        color="error.contrastText"
                        sx={{
                          position: "absolute",
                          bottom: 10,
                          fontStyle: "italic",
                        }}
                      >
                        {chapter.currentProgress > 0 &&
                          chapter.currentProgress < 100 && (
                            <LinearProgress
                              variant="determinate"
                              value={chapter.currentProgress}
                              sx={{
                                height: 5,
                                borderRadius: 4,
                              }}
                              color="inherit"
                            />
                          )}
                        {
                          //Also, remove the weekday from the date

                          chapter.currentProgress > 0 &&
                          chapter.currentProgress < 100
                            ? `Progress: ${chapter.currentProgress}%`
                            : chapter.isCompleted
                            ? `Completed on ${new Intl.DateTimeFormat("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }).format(
                                new Date(chapter.completionDate || "")
                              )}`
                            : "Not learned yet"
                        }
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid2>
              ))}
            </AnimatePresence>
          </Grid2>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <AnimatePresence>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <DataGrid<ChapterInterface>
                rows={filteredChapters}
                columns={columns.map((column) => ({
                  ...column,
                  renderCell: (params) => (
                    <motion.div
                      key={params.row._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      {column.renderCell
                        ? column.renderCell(params)
                        : params.value || ""}
                    </motion.div>
                  ),
                }))}
                getRowId={(row) => row._id}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                disableRowSelectionOnClick
                disableColumnMenu
                disableColumnSorting
                autosizeOnMount
                autosizeOptions={{
                  columns: ["title"],
                  includeOutliers: false,
                  includeHeaders: true,
                }}
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  "& .MuiDataGrid-root": {
                    borderRadius: 2,
                  },
                }}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
              />
            </Box>
          </AnimatePresence>
        </motion.div>
      )}
    </Paper>
  );
}
