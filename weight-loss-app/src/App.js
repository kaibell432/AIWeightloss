import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Register from './components/Register';
import Login from './components/Login';
import Account from './components/Account';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Footer from './components/Footer';
import MealPlanForm from './components/MealPlanForm';
import MealPlanResults from './components/MealPlanResults';

function App() {
  const [results, setResults] = useState(null);
  const [mealPlanResults, setMealPlanResults] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // Now works because App is within <Router>

  // Check auth status
  useEffect(() => {
    fetch('/api/checkAuth', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setIsAuthenticated(data.isAuthenticated);
      })
      .catch(err => {
        console.error('Error checking authentication:', err);
      });
  }, []);

  const handleLogout = () => {
    fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(() => {
        setIsAuthenticated(false);
        navigate('/login'); // Now works without error
      })
      .catch(err => {
        console.error('Error during logout', err);
      });
  };

  return (
    <>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div style={{ marginTop: `3em` }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <InputForm setResults={setResults} />
                {results && <Results data={results} />}
              </>
            }
          />
          <Route
            path="/meal-plan-generator"
            element={
              <>
                <MealPlanForm setMealPlanResults={setMealPlanResults} />
                {mealPlanResults && <MealPlanResults data={mealPlanResults} />}
              </>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/account"
            element={
              isAuthenticated ? (
                <Account />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
