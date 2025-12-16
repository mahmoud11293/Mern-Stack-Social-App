import { Navigate } from "react-router-dom";

export default function ProtectedAuthRoutes({ children }) {
  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }
  return children;
}
