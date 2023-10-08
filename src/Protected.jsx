import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ valid, children }) => {
  if (!valid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
export default ProtectedRoute;