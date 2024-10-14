import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Footer from './components/Footer';
import MealPlanForm from './components/MealPlanForm';
import MealPlanResults from './components/MealPlanResults';

function App() {
  const [results, setResults] = useState(null)
  const [mealPlanResults, setMealPlanResults] = useState(null)
  
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
          </Routes>
        </div>
      <Footer />
    </Router>
  );
}

export default App;