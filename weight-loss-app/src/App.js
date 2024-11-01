import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, NavLink } from 'react-router-dom';
import Header from './components/Header';
import Register from './components/Register';
import Login from './components/Login';
import Account from './components/Account';
import Home from './components/Home';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Footer from './components/Footer';
import MealPlanForm from './components/MealPlanForm';
import MealPlanResults from './components/MealPlanResults';
import { Sidebar, Menu } from 'semantic-ui-react';

function App() {
  const [results, setResults] = useState(null);
  const [mealPlanResults, setMealPlanResults] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  const handleSidebarHide = () => setVisible(false);
  const handleToggle = () => setVisible(!visible);

  // Handle window resize to update isMobile state
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', 
      });

      if (response.ok) {
        setIsAuthenticated(false);
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  return (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        animation="overlay"
        inverted
        onHide={handleSidebarHide}
        vertical
        visible={visible}
        >
          <Menu.Item as={NavLink} to="/" onClick={handleSidebarHide}>
            Home
          </Menu.Item>
          <Menu.Item as={NavLink} to="/weight-suggestions" onClick={handleSidebarHide}>
            Weight Suggestions
          </Menu.Item>
          <Menu.Item as={NavLink} to="/meal-plan-generator" onClick={handleSidebarHide}>
            Meal Plan Generator
          </Menu.Item>
          {isAuthenticated ? (
            <>
              <Menu.Item as={NavLink} to="/account" onClick={handleSidebarHide}>
                Account
              </Menu.Item>
              <Menu.Item onClick={() => { handleLogout(); handleSidebarHide();}}>
                Log Out
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item as={NavLink} to="/login" onClick={handleSidebarHide}>
                Log In
              </Menu.Item>
              <Menu.Item as={NavLink} to="/register" onClick={handleSidebarHide}>
                Register
              </Menu.Item>
            </>
          )}
        </Sidebar>

        <Sidebar.Pusher dimmed={visible} style={{ minHeight: '100vh' }}>              
            <Header 
              isAuthenticated={isAuthenticated} 
              onLogout={handleLogout} 
              isMobile={isMobile}
              visible={visible}
              handleToggle={handleToggle}
              handleSidebarHide={handleSidebarHide}
              />
            <div style={{ marginTop: `3em` }}>
              <Routes>
              <Route
                  path="/"
                  element={
                    <>
                      <Home isAuthenticated={isAuthenticated}/>
                    </>
                  }
                />
                <Route
                  path="/weight-suggestions"
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
        </Sidebar.Pusher>
    </Sidebar.Pushable>
    
    
  );
}

export default App;
