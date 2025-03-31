import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[]; // Explicitly define allowedRoles as a string array
}

const ProtectedRoute : React.FC<ProtectedRouteProps> =  ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // Get role from local storage
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;


