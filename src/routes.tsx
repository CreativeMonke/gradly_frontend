import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { AnimatePresence, motion } from "framer-motion";

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
  const location = useLocation(); // ✅ Get the current location

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}> {/* ✅ Ensure key changes on route change */}
        <Route
          path="/"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <HomePage />
            </motion.div>
          }
        />
        <Route
          path="/auth/login"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <LoginPage />
            </motion.div>
          }
        />
        <Route
          path="/auth/register"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <RegisterPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
