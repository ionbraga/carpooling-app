import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/rides" replace />;
  }

  return children;
}
