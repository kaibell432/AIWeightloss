import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Register from './components/Register';
import Login from './components/Login';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Footer from './components/Footer';
import MealPlanForm from './components/MealPlanForm';
import MealPlanResults from './components/MealPlanResults';

function App() {
  const [results, setResults] = useState(null)
  const [mealPlanResults, setMealPlanResults] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
  
  return (
    <Router>
      <Header/>
        <div style={{ marginTop: `3em` }}>
          <Routes>
            <Route path="/" element={
              <>
              <InputForm setResults={setResults} />
              {results && <Results data={results}/>}
              </>
              }
            />
            <Route path="/meal-plan-generator" element={
              <>
              <MealPlanForm setMealPlanResults={setMealPlanResults}/>
              {mealPlanResults && <MealPlanResults data={mealPlanResults}/>}
              </>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setAuth={setIsAuthenticated}/>} />
          </Routes>
        </div>
      <Footer />
    </Router>
  );
}

export default App;