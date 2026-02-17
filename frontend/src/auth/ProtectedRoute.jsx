import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  const decoded = jwtDecode(token);
  const userRole =
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
