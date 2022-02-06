import React from "react"
import styled from "styled-components"

const Register = (props: { register: number[] }) => {
  let register_data = []
  for (const i in props.register) {
    register_data.push(
      <div key={i}>
        {props.register[i].toString(2).padStart(8, '0')} {props.register[i]}
      </div>
    )
  }
  return (
    <Body>
      <Tag>Register</Tag>
      {register_data}
    </Body>
  )
}

const Body = styled.div`
  width: 95px;
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

export default Register