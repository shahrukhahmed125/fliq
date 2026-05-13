import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token"); // or your auth state

  if (token) {
    return <Navigate to="/feed" replace />;
  }

  return children;
}