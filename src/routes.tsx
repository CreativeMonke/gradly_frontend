import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { AnimatePresence, motion } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import DashboardPage from "./pages/DashboardPage";
import { SubjectOverviewPage } from "./pages/subjects/SubjectOverviewPage";
import CreateSubjectPage from "./pages/subjects/CreateSubjectPage";
import SubjectPage from "./pages/subjects/SubjectEditPage";
import { ChaptersOverviewPage } from "./pages/subjects/chapters/ChaptersOverviewPage";

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } },
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <HomePage />
            </motion.div>
          }
        />

        {/* Redirect logged-in users away from login/register */}
        <Route element={<RedirectIfAuthenticated />}>
          <Route
            path="/auth/login"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <LoginPage />
              </motion.div>
            }
          />
          <Route
            path="/auth/register"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <RegisterPage />
              </motion.div>
            }
          />
        </Route>

        {/* Protected Routes (Only accessible when logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <DashboardPage />
              </motion.div>
            }
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/subjects"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <SubjectOverviewPage />
              </motion.div>
            }
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/subjects/create-subject"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <CreateSubjectPage />
              </motion.div>
            }
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/subjects/:subjectId"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <SubjectPage />
              </motion.div>
            }
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/subjects/:subjectId/edit"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <SubjectPage />
              </motion.div>
            }
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/subjects/:subjectId/:chapterId"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <ChaptersOverviewPage />
              </motion.div>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
