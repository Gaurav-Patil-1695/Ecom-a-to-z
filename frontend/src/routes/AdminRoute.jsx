import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ADMIN_ROLE = 'admin';

const parseJwtPayload = (token) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const AdminRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const payload = parseJwtPayload(token);
  const roles = payload?.roles ?? payload?.role ?? [];
  const roleList = Array.isArray(roles) ? roles : [roles];
  const isAdmin = roleList.includes(ADMIN_ROLE);

  if (!isAdmin) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
