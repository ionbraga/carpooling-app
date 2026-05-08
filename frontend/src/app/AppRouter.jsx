import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { PublicOnlyRoute } from '../components/layout/PublicOnlyRoute';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { RidesPage } from '../pages/RidesPage';
import { CreateRidePage } from '../pages/CreateRidePage';
import { MyBookingsPage } from '../pages/MyBookingsPage';
import { MyRidesPage } from '../pages/MyRidesPage';
import { UserReviewsPage } from '../pages/UserReviewsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProfilePage } from '../pages/ProfilePage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route path="/rides" element={<RidesPage />} />
        <Route
          path="/rides/create"
          element={
            <ProtectedRoute>
              <CreateRidePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rides/my"
          element={
            <ProtectedRoute>
              <MyRidesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
        <Route path="/reviews/:userId" element={<UserReviewsPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}