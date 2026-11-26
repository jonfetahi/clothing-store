import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../../context/auth-context';
import { AppLoader } from './AppLoader';

type Props = {
  redirectPath?: string;
}

export function ProtectedRoute({ redirectPath = '/public' }: Props) {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  console.log(isAdmin);

  if (loading) return <AppLoader />

  if (!isAdmin) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  return <Outlet />
}