import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children, roles }) => {
  const user = useSelector((state) => state.user.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
