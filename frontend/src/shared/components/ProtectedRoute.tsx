import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../../context/auth-context';

type Props = {
  redirectPath?: string;
}

export function ProtectedRoute({ redirectPath = '/public' }: Props) {
  const { isAuthenticated } = useAuth();
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  return <Outlet />
}