import React from 'react';
import { executeCpu } from './service/cpu';
import './App.css';

function App() {
  const result = executeCpu()
  return (
    <p>{result}</p>
  );
}

export default App;
