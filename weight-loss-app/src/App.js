import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Footer from './components/Footer';

function App() {
  const [results, setResults] = useState(null)
  
  return (
    <Router>
      <Header/>
        <div style={{ marginTop: `3em` }}>
          <Routes>
            <Route path="/" element={<InputForm setResults={setResults} />} />
          </Routes>
          {results && <Results data={results}/>}
        </div>
      <Footer />
    </Router>
  );
}

export default App;