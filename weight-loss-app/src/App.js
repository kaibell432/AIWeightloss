import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Footer from './components/Footer';

function App() {
  
  return (
    <Router>
      <Header/>
        <div style={{ marginTop: `3em` }}>
          <Routes>
            <Route path="/" element={<InputForm />} />
            <Route path="/results" exact component={<Results />} />
          </Routes>
        </div>
      <Footer />
    </Router>
  );
}

export default App;