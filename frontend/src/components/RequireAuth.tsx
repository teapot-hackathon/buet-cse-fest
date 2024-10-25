import { useLocation, Navigate, Outlet } from "react-router-dom";
import useStore from "../store/store";
import { useAuth } from "@clerk/clerk-react";

function RequireAuth() {
  const location = useLocation();
  const auth = useAuth();

  return auth.isSignedIn ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />
  );
}
export default RequireAuth;
