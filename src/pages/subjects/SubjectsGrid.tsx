import { useEffect } from "react";
import { Paper, Grid2, Typography, Box } from "@mui/material";
import { BookRounded } from "@mui/icons-material";
import { useSubjectsStore } from "../../store/subjectsStore";
import { useAuthStore } from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";

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

export const SubjectsGrid = () => {
  const { subjects, fetchSubjects, loading, error } = useSubjectsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?._id) {
      fetchSubjects(user._id);
    }
  }, [user, fetchSubjects]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  console.log(subjects);
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
                      <BookRounded />
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
