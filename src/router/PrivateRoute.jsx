import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children, roles }) => {
  const userId = useSelector((state) => state.user.userId);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
