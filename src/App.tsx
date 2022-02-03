import React from 'react';
import { assembler } from './service/rom';
import { executeCpu } from './service/cpu';
import './App.css';

function App() {
  const rom = assembler()
  const result = executeCpu(rom)
  return (
    <p>{result}</p>
  );
}

export default App;
