import React, { useEffect } from "react";
import {
  Paper,
  Grid2,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  AttachMoneyRounded,
  BookRounded,
  BrushRounded,
  CodeRounded,
  EditLocationRounded,
  EditRounded,
  EngineeringRounded,
  FileCopyRounded,
  LanguageRounded,
  MoreVertRounded,
  PublicRounded,
  SchoolRounded,
  ScienceRounded,
  SportsSoccerRounded,
} from "@mui/icons-material";
import { Subject, useSubjectsStore } from "../../store/subjectsStore";
import { useAuthStore } from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const categoryIconMap: Record<string, React.ReactNode> = {
  "math-computer-science": <CodeRounded />, // ✅ Mathematics-Computer Science
  "natural-sciences": <ScienceRounded />, // ✅ Natural Sciences
  philology: <LanguageRounded />, // ✅ Philology
  "social-sciences": <PublicRounded />, // ✅ Social Sciences
  "technical-sciences": <EngineeringRounded />, // ✅ Technical Sciences
  "natural-resources-environment": <EditLocationRounded />, // ✅ Natural Resources and Environmental Protection
  "economic-sciences": <AttachMoneyRounded />, // ✅ Economic Sciences
  arts: <BrushRounded />, // ✅ Arts
  sports: <SportsSoccerRounded />, // ✅ Sports
  pedagogy: <SchoolRounded />, // ✅ Pedagogy
};

export const SubjectsGrid = () => {
  const [menuAnchor, setMenuAnchor] = React.useState<{
    anchorEl: HTMLElement | null;
    subjectId: string | null;
  }>({ anchorEl: null, subjectId: null });
  const { subjects, fetchSubjects, createSubject, loading, error } =
    useSubjectsStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?._id) {
      fetchSubjects(user._id);
    }
  }, [user, fetchSubjects]);

  if (loading)
    return (
      <Paper
        sx={{
          height: "40vh",
          backgroundColor: "transparent",
          borderRadius: 3,
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
  function handleSubjectClick(subject: Subject) {
    navigate(`/subjects/${subject._id}`);
  }

  function handleActionButtonClick(
    event: React.MouseEvent<HTMLElement>,
    subjectId: string
  ) {
    event.stopPropagation();
    setMenuAnchor({ anchorEl: event.currentTarget, subjectId });
  }

  // ✅ Close menu
  function handleActionButtonClose() {
    setMenuAnchor({ anchorEl: null, subjectId: null });
  }

  function handleEditSubject(subject: Subject) {
    handleActionButtonClose();
    navigate(`/subjects/${subject._id}/edit`);
  }

  async function handleDuplicateSubject(subject: Subject) {
    handleActionButtonClose();
    await createSubject({
      name: subject.name + " (Copy)",
      description: subject.description,
      subjectCategory: subject.subjectCategory,
      isMarketplaceVisible: subject.isMarketplaceVisible,
      isTemplate: subject.isTemplate,
    });
    console.log("Duplicating subject", subject.name);
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        ///Transparent background
        backgroundColor: "transparent",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <Grid2 container spacing={2}>
          <AnimatePresence>
            {subjects.map((subject) => (
              <Grid2 key={subject._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <Paper
                    elevation={12}
                    onClick={() => {
                      handleSubjectClick(subject);
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
                        top: 12,
                        left: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        padding: 0.5,
                        opacity: 0, // Hidden by default
                        transition: "opacity 0.2s ease-in-out",
                      }}
                    >
                      {categoryIconMap[subject.subjectCategory] || (
                        <BookRounded />
                      )}
                    </Box>
                    {/* Actions menu */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        padding: 0.5,
                      }}
                    >
                      <IconButton
                        onClick={(event) =>
                          handleActionButtonClick(event, subject._id)
                        }
                      >
                        <MoreVertRounded />
                      </IconButton>
                      <Menu
                        anchorEl={
                          menuAnchor.subjectId === subject._id
                            ? menuAnchor.anchorEl
                            : null
                        }
                        open={
                          menuAnchor.subjectId === subject._id &&
                          Boolean(menuAnchor.anchorEl)
                        }
                        onClose={handleActionButtonClose}
                      >
                        <MenuItem
                          onClick={(event: React.MouseEvent<HTMLElement>) => {
                            handleEditSubject(subject);
                            event.stopPropagation(); // ✅ Stop event propagation
                          }}
                          disableRipple
                        >
                          <EditRounded sx={{ mr: 1 }} />
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={(event: React.MouseEvent<HTMLElement>) => {
                            handleDuplicateSubject(subject);
                            event.stopPropagation(); // ✅ Stop event propagation
                          }}
                          disableRipple
                        >
                          <FileCopyRounded sx={{ mr: 1 }} />
                          Duplicate
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
                      {subject.name}
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
                      {subject.description || "No description"}
                    </Typography>

                    {/* Category */}
                    <Typography
                      variant="caption"
                      color="textDisabled"
                      sx={{
                        position: "absolute",
                        bottom: 10,
                        fontStyle: "italic",
                      }}
                    >
                      {subject.subjectCategory.replace("-", " ").toUpperCase()}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid2>
            ))}
          </AnimatePresence>
        </Grid2>
      </motion.div>
    </Paper>
  );
};
