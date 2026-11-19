import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/toast';
import { api } from '@/lib/api';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ServerWaking from '@/components/ServerWaking';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';

// Code-split the heavier pages so the landing page loads fast on a cold start.
const Suggestions = lazy(() => import('@/pages/Suggestions'));
const MealPlanner = lazy(() => import('@/pages/MealPlanner'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const Account = lazy(() => import('@/pages/Account'));

export default function App() {
  // null = still checking (the free Render instance may be waking up)
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  // Results live here so they survive navigating between pages.
  const [suggestions, setSuggestions] = useState(null);
  const [mealPlans, setMealPlans] = useState(null);

  useEffect(() => {
    api('/checkAuth')
      .then((d) => setIsAuthenticated(d.isAuthenticated))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await api('/logout', { method: 'POST' });
      setIsAuthenticated(false);
      toast.success('Logged out');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  }, [navigate]);

  const requireAuth = (element) =>
    isAuthenticated === null ? null : isAuthenticated ? element : <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <ServerWaking ready={isAuthenticated !== null} />
      <main className="flex-1">
        <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route
            path="/weight-suggestions"
            element={<Suggestions result={suggestions} setResult={setSuggestions} />}
          />
          <Route
            path="/meal-plan-generator"
            element={
              <MealPlanner result={mealPlans} setResult={setMealPlans} isAuthenticated={isAuthenticated} />
            }
          />
          <Route path="/login" element={<AuthPage mode="login" onAuthenticated={() => setIsAuthenticated(true)} />} />
          <Route
            path="/register"
            element={<AuthPage mode="register" onAuthenticated={() => setIsAuthenticated(true)} />}
          />
          <Route path="/account" element={requireAuth(<Account />)} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
