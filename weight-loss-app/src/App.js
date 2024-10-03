import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Footer from './components/Footer';

function App() {
  const [results, setResults] = useState(null);

  return (
    <div className="App">
      <Header />
      <InputForm setResults={setResults} />
      {results && <Results data={results} />}
      <Footer />
    </div>
  );
}

export default App;