import React from 'react';
import styled from "styled-components"

const Rom = (props: { rom: number[], count: number }) => {
  let rom_data = []
  let data = null
  for (const i in props.rom) {
    if (i === (props.count -1).toString()) {
      data = <Fetched key={i}>{props.rom[i].toString(2).padStart(16, '0')}</Fetched>
    } else {
      data = <div key={i}>{props.rom[i].toString(2).padStart(16, '0')}</div>
    }
    rom_data.push(data)
  }
  return (
    <Body>
      <Tag>ROM</Tag>
      {rom_data}
    </Body>
  );
}

const Body = styled.div`
  text-align: center;
  width: 150px;
  padding: 0 15px 10px 15px;
  margin: 5px 10px;
  background-color: #222222;
  color: white;
  border-radius: 4px;
`
const Tag = styled.div`
  background-color: #444444;
  width: 60px;
  padding: 0 10px;
  margin: 0 auto;
  clip-path: polygon(10% 100%, 0% 0%, 100% 0%, 90% 100%);
`

const Fetched = styled.div`
  background-color: #555;
`

export default Rom