import React from "react"
import styled from "styled-components"

const Counter = (props: { count: number }) => {
  return (
    <Body>
      <Tag>Counter</Tag>
      <div>{props.count}</div>
    </Body>
  )
}

const Body = styled.div`
  display: inline-block;
  width: 90px;
  margin:  5px 10px;
  padding: 0 10px 10px 10px;
  background-color: #222222;
  color: white;
  border-radius: 4px;
  text-align: center;
`
const Tag = styled.div`
  background-color: #444444;
  width: 60px;
  padding: 0 10px;
  margin: 0 auto;
  clip-path: polygon(10% 100%, 0% 0%, 100% 0%, 90% 100%);
`

export default Counter