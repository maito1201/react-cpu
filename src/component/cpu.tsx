import { decode } from 'punycode';
import React from 'react';
import { useState, useEffect } from 'react'
import styled from "styled-components"
import { assembler } from '../service/rom';
import { OPERATOR as OP, REGISTER as REG } from '../service/isa'
import Rom from './rom'
import Counter from '../component/counter'
import Fetcher from './fetcher'
import Decoder from './decoder'
import Register from './register'
import Ram from '../component/ram'

const Cpu = () => {
  const blank_rom: number[] = []
  const [rom, setRom] = useState(blank_rom)
  const [count, setCount] = useState(0)
  const [register, setRegister] = useState(REG)
  const [instruction, setInstruction] = useState(0)
  const [decoded_ir, setDecodedIr] = useState('')
  let RAM: number[] = []
  for (let i = 0; i < 8; i++) {
    RAM[i] = 0
  }

  const [ram, setRam] = useState(RAM)
  useEffect(() => {
    const rom = assembler()
    setRom([...rom])
    executeCpu(rom)
  }, []);

  async function executeCpu(rom: number[]): Promise<void> {
    // プログラムカウンタ
    let pc = 0
    // インストラクションレジスタ
    let ir = 0
    let flag_eq = 0
    const clock_ms = 200
    const sleep = (waitTime: number) => new Promise( resolve => setTimeout(resolve, waitTime) );
    while (op_code(ir) !== OP['HLT']) {
      // 命令の内容を取得
      ir = rom[pc]
      setInstruction(ir)
      console.log(`program count=${pc}`, `instruction=${ir}`, `register=${REG}`)
      setRegister([...REG])
      // プログラムカウンタを更新
      pc ++
      setCount(pc)
      // 命令の種類に応じた処理を行う
      switch (op_code(ir)) {
        case OP['MOV']:
          console.log(`MOV: copy ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
          setDecodedIr(`MOV: copy ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
          REG[op_regA(ir)] = REG[op_regB(ir)]
          break
        case OP['ADD']:
          console.log(`ADD: write ${REG[op_regA(ir)]} + ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
          setDecodedIr(`ADD: write ${REG[op_regA(ir)]} + ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
          REG[op_regA(ir)] = REG[op_regA(ir)] + REG[op_regB(ir)]
          break
        case OP['SUB']:
          console.log(`SUB: write ${REG[op_regA(ir)]} - ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
          setDecodedIr(`SUB: write ${REG[op_regA(ir)]} - ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
          REG[op_regA(ir)] = REG[op_regA(ir)] - REG[op_regB(ir)]
          break
        case OP['AND']:
          console.log(`AND: write ${REG[op_regA(ir)]} & ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
          setDecodedIr(`AND: write ${REG[op_regA(ir)]} & ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
          REG[op_regA(ir)] = REG[op_regA(ir)] & REG[op_regB(ir)]
          break
        case OP['OR']:
          console.log(`OR: write ${REG[op_regA(ir)]} | ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
          setDecodedIr(`OR: write ${REG[op_regA(ir)]} | ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
          REG[op_regA(ir)] = REG[op_regA(ir)] | REG[op_regB(ir)]
          break
        case OP['SL']:
          console.log(`SL: shift left register[${op_regA(ir)}]`)
          setDecodedIr(`SL: shift left register[${op_regA(ir)}]`)
          REG[op_regA(ir)] = REG[op_regA(ir)] << 1
          break
        case OP['SR']:
          console.log(`SR: shift right register[${op_regA(ir)}]`)
          setDecodedIr(`SR: shift right register[${op_regA(ir)}]`)
          REG[op_regA(ir)] = REG[op_regA(ir)] >> 1
          break
        case OP['SRA']:
          console.log(`SRA: shift right arithmetic register[${op_regA(ir)}]`)
          setDecodedIr(`SRA: shift right arithmetic register[${op_regA(ir)}]`)
          REG[op_regA(ir)] = (REG[op_regA(ir)] & 0x8000) | (REG[op_regA(ir)] >> 1)
          break
        case OP['LDL']:
          REG[op_regA(ir)] = (REG[op_regA(ir)] & 0xff00) | (op_data(ir) & 0x00ff)
          console.log(`LDL: load value low (${(REG[op_regA(ir)] & 0xff00) | (op_data(ir) & 0x00ff)}) to register[${op_regA(ir)}]`)
          setDecodedIr(`LDL: load value low (${(REG[op_regA(ir)] & 0xff00) | (op_data(ir) & 0x00ff)}) to register[${op_regA(ir)}]`)
          break
        case OP['LDH']:
          REG[op_regA(ir)] = (op_data(ir) << 8) | (REG[op_regA(ir)] & 0x00ff)
          console.log(`LDH: load value high (${(op_data(ir) << 8) | (REG[op_regA(ir)] & 0xff)}) to register[${op_regA(ir)}]`)
          setDecodedIr(`LDH: load value high (${(op_data(ir) << 8) | (REG[op_regA(ir)] & 0xff)}) to register[${op_regA(ir)}]`)
          break
        case OP['CMP']:
          console.log(`CMP: compare ${REG[op_regA(ir)]} and ${REG[op_regB(ir)]}`)
          setDecodedIr(`CMP: compare ${REG[op_regA(ir)]} and ${REG[op_regB(ir)]}`)
          flag_eq = (REG[op_regA(ir)] === REG[op_regB(ir)]) ? 1 : 0
          break
        case OP['JE']:
          console.log(`JE: jump to ${op_addr(ir)} if flag is true, flag = ${flag_eq === 1}`)
          setDecodedIr(`JE: jump to ${op_addr(ir)} if flag is true, flag = ${flag_eq === 1}`)
          if (flag_eq === 1) {
            pc = op_addr(ir)
            setCount(pc)
          }
          break
        case OP['JMP']:
          console.log(`JMP: jump to ${op_addr(ir)}`)
          setDecodedIr(`JMP: jump to ${op_addr(ir)}`)
          pc = op_addr(ir)
          setCount(pc)
          break
        case OP['LD']:
          console.log(`LD: load ${RAM[op_regA(ir)]} to register[${op_regA(ir)}]`)
          setDecodedIr(`LD: load ${RAM[op_regA(ir)]} to register[${op_regA(ir)}]`)
          REG[op_regA(ir)] = RAM[op_addr(ir)]
          break
        case OP['ST']:
          console.log(`ST: store ${REG[op_regA(ir)]} to ram[${op_addr(ir)}]`)
          setDecodedIr(`ST: store ${REG[op_regA(ir)]} to ram[${op_addr(ir)}]`)
          RAM[op_addr(ir)] = REG[op_regA(ir)]
          setRam([...RAM])
          break
        default:
          break
      }
      await sleep(clock_ms)
    }
    console.log('HLT')
    setDecodedIr('HLT')
  }


  return (
    <Body>
      <InlineArea>
        <Rom rom={rom} count={count}/>
      </InlineArea>
      <InlineArea>
        <Fetcher ir={instruction}/>
        <Counter count={count}/>
        <Decoder decoded={decoded_ir}/>
        <Register register={register}/>
      </InlineArea>
      <InlineArea>
        <Ram ram={ram} key='ram'/>
      </InlineArea>
    </Body>
  )
}

// 命令のビット配列を取得する
function op_code(ir: number): number {
  return (ir >> 11)
}

// レジスタAのビット配列を取得する
function op_regA(ir: number): number {
  return ((ir >> 8) & 0x0007)
}

// レジスタBのビット配列を取得する
function op_regB(ir: number): number {
  return ((ir >> 5) & 0x0007)
}

// データ情報のビット配列を取得する
function op_data(ir: number): number {
  return (ir & 0x00ff)
}

// アドレス情報のビット配列を取得する
function op_addr(ir: number): number {
  return (ir & 0x00ff)
}

const Body = styled.div`
  background-color: #ddd;
  color: white;
  padding: 10px;
  line-height:16px;
`

const InlineArea = styled.div`
  display: inline-block;
  vertical-align: top;
`

export default Cpu