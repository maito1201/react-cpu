import { OPERATOR as OP } from './isa'

/* eslint-disable @typescript-eslint/no-unused-vars */
const REG0 = 0
const REG1 = 1
const REG2 = 2
const REG3 = 3
const REG4 = 4
const REG5 = 5
const REG6 = 6
const REG7 = 7
/* eslint-enable @typescript-eslint/no-unused-vars */

// romに書き込む機械語をセットする
export function assembler(): number[] {
  let rom: number[] = []
  rom[0] = ldh(REG0, 0)
  rom[1] = ldl(REG0, 0)
  rom[2] = ldh(REG1, 0)
  rom[3] = ldl(REG1, 1)
  rom[4] = ldh(REG2, 0)
  rom[5] = ldl(REG2, 0)
  rom[6] = ldh(REG3, 0)
  rom[7] = ldl(REG3, 10)
  rom[8] = add(REG2, REG1)
  rom[9] = add(REG0, REG2)
  rom[10] = st(REG0, 0)
  rom[11] = cmp(REG2, REG3)
  rom[12] = je(14)
  rom[13] = jmp(8)
  rom[14] = hlt()
  console.log(`set rom ${rom}`)
  return rom
}

/* eslint-disable @typescript-eslint/no-unused-vars */
// MOV命令のビット配列を返す
function mov(ra: number, rb: number): number {
  return ((OP['MOV'] << 11) | (ra << 8) | (rb << 5))
}

// ADD命令のビット配列を返す
function add(ra: number, rb: number): number {
  return ((OP['ADD'] << 11) | (ra << 8) | (rb << 5))
}

// SUB命令のビット配列を返す
function sub(ra: number, rb: number): number {
  return ((OP['SUB'] << 11) | (ra << 8) | (rb << 5))
}

// AND命令のビット配列を返す
function and(ra: number, rb: number): number {
  return ((OP['AND'] << 11) | (ra << 8) | (rb << 5))
}

// OR命令のビット配列を返す
function or(ra: number, rb: number): number {
  return ((OP['OR'] << 11) | (ra << 8) | (rb << 5))
}

// SL命令のビット配列を返す
function sl(ra: number): number {
  return ((OP['SL'] << 11) | (ra << 8))
}

// SR命令のビット配列を返す
function sr(ra: number): number {
  return ((OP['SR'] << 11) | (ra << 8))
}

// SRA命令のビット配列を返す
function sra(ra: number): number {
  return ((OP['SRA'] << 11) | (ra << 8))
}

// LDL命令のビット配列を返す
function ldl(ra: number, ival: number): number {
  return ((OP['LDL'] << 11) | (ra << 8) | (ival & 0x00ff))
}

// LDH命令のビット配列を返す
function ldh(ra: number, ival: number): number {
  return ((OP['LDH'] << 11) | (ra << 8) | (ival & 0x00ff))
}

// CMP命令のビット配列を返す
function cmp(ra: number, rb: number): number {
  return ((OP['CMP'] << 11) | (ra << 8) | (rb << 5))
}

// JE命令のビット配列を返す
function je(addr: number): number {
  return ((OP['JE'] << 11) | (addr & 0x00ff))
}

// JMP命令のビット配列を返す
function jmp(addr: number): number {
  return ((OP['JMP'] << 11) | (addr & 0x00ff))
}

// LD命令のビット配列を返す
function ld(ra: number, addr: number): number {
  return ((OP['LD'] << 11) | (ra << 8) | (addr & 0x00ff))
}

// ST命令のビット配列を返す
function st(ra: number, addr: number): number {
  return ((OP['ST'] << 11) | (ra << 8) | (addr & 0x00ff))
}

// HLT命令のビット配列を返す
function hlt(): number {
  return (OP['HLT'] << 11)
}
/* eslint-enable @typescript-eslint/no-unused-vars */
