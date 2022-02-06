import React from 'react'
import styled from 'styled-components'

const Ram = (props: { ram: number[] }) => {

  let ram_data = []
  for (const i in props.ram) {
    ram_data.push(
      <div key={i}>{props.ram[i]?.toString(2).padStart(16, '0')} {props.ram[i]}</div>
    )
  }
  return (
    <Body>
      <Tag>Ram</Tag>
      {ram_data}
    </Body>
  )
}

const Body = styled.div`
  width: 160px;
  padding: 0 15px 10px 15px;
  margin: 5px 10px;
  background-color: #222222;
  color: white;
  border-radius: 4px;
`
const Tag = styled.div`
  text-align: center;
  background-color: #444444;
  width: 60px;
  padding: 0 10px;
  margin: 0 auto;
  clip-path: polygon(10% 100%, 0% 0%, 100% 0%, 90% 100%);
`

export default Ram