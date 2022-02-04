import React from 'react';
import { assembler } from './service/rom';
import { executeCpu } from './service/cpu';
import Rom from './component/rom';
import styled from "styled-components"
import './App.css';

function App() {
  const rom = assembler()
  const result = executeCpu(rom)
  return (
    <>
      <Rom rom={rom}/>
      <p>計算結果は{result}</p>
    </>
  );
}

const Cpu = styled.div`
  background-color: gray;
  width: 250px;
  margin: 10px;
`

export default App;
