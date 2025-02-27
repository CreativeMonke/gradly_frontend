import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RedirectIfAuthenticated = () => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default RedirectIfAuthenticated;
