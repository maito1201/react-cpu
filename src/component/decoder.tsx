import React from 'react'
import styled from 'styled-components'

const Decoder = (props: { decoded: string }) => {
  return (
    <Body>
      <Tag>Decoder, ALU</Tag>
      <div>{props.decoded}</div>
    </Body>
  )
}

const Body = styled.div`
  width: 300px;
  padding: 0 10px 10px 10px;
  margin: 5px 10px;
  background-color: #222222;
  color: white;
  border-radius: 4px;
  text-align: center;
`
const Tag = styled.div`
  background-color: #444444;
  width: 120px;
  padding: 0 10px;
  margin: 0 auto;
  clip-path: polygon(7% 100%, 0% 0%, 100% 0%, 93% 100%);
`

export default Decoder