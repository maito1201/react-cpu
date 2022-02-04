import React from 'react';
import styled from "styled-components"

const Rom = (props: { rom: number[] }) => {
  let rom_data = []
  for (const i in props.rom) {
    rom_data.push(
      <div key={i}>{props.rom[i].toString(2).padStart(16, '0')}</div>
    )
  }
  return (
    <>
      <Wrapper>
        <Body>
          <Tag>ROM</Tag>
          {rom_data}
        </Body>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  margin: 10px;
  padding: 0 4px;
  width: 170px;
  text-align: center;
  background-color: #aaa;
  background-image:
    linear-gradient(-90deg, #fff 50%, transparent 0%), linear-gradient(#fff 50%, transparent 0%);
  background-size: 40px 20px;
`
const Body = styled.div`
  padding: 0 10px 10px 10px;
  background-color: #222222;
  color: white;
  border-radius: 4px;
`
const Tag = styled.span`
  background-color: #444444;
  width: 50px;
  padding: 0 10px;
  clip-path: polygon(10% 100%, 0% 0%, 100% 0%, 90% 100%);
`

export default Rom