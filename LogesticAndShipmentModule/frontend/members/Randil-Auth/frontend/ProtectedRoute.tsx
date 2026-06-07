import { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Wraps pages that require authentication.
 * If the user is not logged in, shows the LoginPage instead.
 *
 * Usage:
 *   <ProtectedRoute>
 *     <ShipmentDashboard />
 *   </ProtectedRoute>
 *
 * TODO: Integrate this with react-router for proper URL-based routing
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login page
  // TODO: Replace with redirect to /login route
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={() => window.location.reload()}
        onNavigateToRegister={() => {
          // TODO: Navigate to /register route
          console.log('Navigate to register');
        }}
      />
    );
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
}
