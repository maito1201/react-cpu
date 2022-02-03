const MOV = 0
const ADD = 1
const SUB = 2
const AND = 3
const OR  = 4
const SL  = 5
const SR  = 6
const SRA = 7
const LDL = 8
const LDH = 9
const CMP = 10
const JE  = 11
const JMP = 12
const LD  = 13
const ST  = 14
const HLT = 15

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

let ROM: number[] = []
let RAM: number[] = []
let REG: number[] = []

export function executeCpu(): number {
  // プログラムカウンタ
  let pc = 0

  // インストラクションレジスタ
  let ir = 0

  let flag_eq = 0

  // ROMに書き込む機械語をセットする
  asssembler()

  while (op_code(ir) !== HLT) {
    // 命令の内容を取得
    ir = ROM[pc]
    console.log(`program count=${pc}`, `instruction=${ir}`, `register=${REG}`)

    // プログラムカウンタを更新
    pc++

    // 命令の種類に応じた処理を行う
    switch (op_code(ir)) {
      case MOV:
        console.log(`MOV: copy ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = REG[op_regB(ir)]
        break
      case ADD:
        console.log(`ADD: write ${REG[op_regA(ir)]} + ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = REG[op_regA(ir)] + REG[op_regB(ir)]
        break
      case SUB:
        console.log(`SUB: write ${REG[op_regA(ir)]} - ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = REG[op_regA(ir)] - REG[op_regB(ir)]
        break
      case AND:
        console.log(`AND: write ${REG[op_regA(ir)]} & ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = REG[op_regA(ir)] & REG[op_regB(ir)]
        break
      case OR:
        console.log(`OR: write ${REG[op_regA(ir)]} | ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = REG[op_regA(ir)] | REG[op_regB(ir)]
        break
      case SL:
        console.log(`SL: shift left register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = REG[op_regA(ir)] << 1
        break
      case SR:
        console.log(`SR: shift right register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = REG[op_regA(ir)] >> 1
        break
      case SRA:
        console.log(`SRA: shift right arithmetic register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = (REG[op_regA(ir)] & 0x8000) | (REG[op_regA(ir)] >> 1)
        break
      case LDL:
        REG[op_regA(ir)] = (REG[op_regA(ir)] & 0xff00) | (op_data(ir) & 0x00ff)
        console.log(`LDL: load value low (${(REG[op_regA(ir)] & 0xff00) | (op_data(ir) & 0x00ff)}) to register[${op_regA(ir)}]`)
        break
      case LDH:
        REG[op_regA(ir)] = (op_data(ir) << 0x0008) | (REG[op_regA(ir)] & 0x00ff)
        console.log(`LDH: load value high (${(op_data(ir) << 0x0008) | (REG[op_regA(ir)] & 0x00ff)}) to register[${op_regA(ir)}]`)
        break
      case CMP:
        console.log(`CMP: compare ${REG[op_regA(ir)]} and ${REG[op_regB(ir)]}`)
        flag_eq = (REG[op_regA(ir)] === REG[op_regB(ir)]) ? 1 : 0
        break
      case JE:
        console.log(`JE: jump to ${op_addr(ir)} if flag is true, flag = ${flag_eq === 1}`)
        if (flag_eq === 1) pc = op_addr(ir)
        break
      case JMP:
        console.log(`JMP: jump to ${op_addr(ir)}`)
        pc = op_addr(ir)
        break
      case LD:
        console.log(`LD: load ${RAM[op_regA(ir)]} to register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = RAM[op_addr(ir)]
        break
      case ST:
        console.log(`ST: store ${REG[op_regA(ir)]} to ram[${op_addr(ir)}]`)
        RAM[op_addr(ir)] = REG[op_regA(ir)]
        break
      default:
        break
    }
  }
  console.log("HLT")
  return RAM[64]
}

// ROMに書き込む機械語をセットする
function asssembler(): void {
  ROM[0] = ldh(REG0, 0)
  ROM[1] = ldl(REG0, 0)
  ROM[2] = ldh(REG1, 0)
  ROM[3] = ldl(REG1, 1)
  ROM[4] = ldh(REG2, 0)
  ROM[5] = ldl(REG2, 0)
  ROM[6] = ldh(REG3, 0)
  ROM[7] = ldl(REG3, 10)
  ROM[8] = add(REG2, REG1)
  ROM[9] = add(REG0, REG2)
  ROM[10] = st(REG0, 64)
  ROM[11] = cmp(REG2, REG3)
  ROM[12] = je(14)
  ROM[13] = jmp(8)
  ROM[14] = hlt()
  console.log(`set ROM ${ROM}`)
}

/* eslint-disable @typescript-eslint/no-unused-vars */
// MOV命令のビット配列を返す
function mov(ra: number, rb: number): number {
  return ((MOV << 0x0011) | (ra << 0x0008) | (rb << 0x0005))
}

// ADD命令のビット配列を返す
function add(ra: number, rb: number): number {
  return ((ADD << 0x0011) | (ra << 0x0008) | (rb << 0x0005))
}

// SUB命令のビット配列を返す
function sub(ra: number, rb: number): number {
  return ((SUB << 0x0011) | (ra << 0x0008) | (rb << 0x0005))
}

// AND命令のビット配列を返す
function and(ra: number, rb: number): number {
  return ((AND << 0x0011) | (ra << 0x0008) | (rb << 0x0005))
}

// OR命令のビット配列を返す
function or(ra: number, rb: number): number {
  return ((OR << 0x0011) | (ra << 0x0008) | (rb << 0x0005))
}

// SL命令のビット配列を返す
function sl(ra: number): number {
  return ((SL << 0x0011) | (ra << 0x0008))
}

// SR命令のビット配列を返す
function sr(ra: number): number {
  return ((SR << 0x0011) | (ra << 0x0008))
}

// SRA命令のビット配列を返す
function sra(ra: number): number {
  return ((SRA << 0x0011) | (ra << 0x0008))
}

// LDL命令のビット配列を返す
function ldl(ra: number, ival: number): number {
  return ((LDL << 0x0011) | (ra << 0x0008) | (ival & 0x00ff))
}

// LDH命令のビット配列を返す
function ldh(ra: number, ival: number): number {
  return ((LDH << 0x0011) | (ra << 0x0008) | (ival & 0x00ff))
}

// CMP命令のビット配列を返す
function cmp(ra: number, rb: number): number {
  return ((CMP << 0x0011) | (ra << 0x0008) | (rb << 0x0005))
}

// JE命令のビット配列を返す
function je(addr: number): number {
  return ((JE << 0x0011) | (addr & 0x00ff))
}

// JMP命令のビット配列を返す
function jmp(addr: number): number {
  return ((JMP << 0x0011) | (addr & 0x00ff))
}

// LD命令のビット配列を返す
function ld(ra: number, addr: number): number {
  return ((LD << 0x0011) | (ra << 0x0008) | (addr & 0x00ff))
}

// ST命令のビット配列を返す
function st(ra: number, addr: number): number {
  return ((ST << 0x0011) | (ra << 0x0008) | (addr & 0x00ff))
}

// HLT命令のビット配列を返す
function hlt(): number {
  return (HLT << 0x0011)
}

// 命令のビット配列を取得する
function op_code(ir: number): number {
  return (ir >> 0x0011)
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
/* eslint-enable @typescript-eslint/no-unused-vars */
