import { OPERATOR as OP, REGISTER as REG } from './isa'

let RAM: number[] = []

export function executeCpu(rom: number[]): number {
  // プログラムカウンタ
  let pc = 0

  // インストラクションレジスタ
  let ir = 0

  let flag_eq = 0

  while (op_code(ir) !== OP['HLT']) {
    // 命令の内容を取得
    ir = rom[pc]
    console.log(`program count=${pc}`, `instruction=${ir}`, `register=${REG}`)

    // プログラムカウンタを更新
    pc++

    // 命令の種類に応じた処理を行う
    switch (op_code(ir)) {
      case OP['MOV']:
        console.log(`MOV: copy ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = REG[op_regB(ir)]
        break
      case OP['ADD']:
        console.log(`ADD: write ${REG[op_regA(ir)]} + ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = REG[op_regA(ir)] + REG[op_regB(ir)]
        break
      case OP['SUB']:
        console.log(`SUB: write ${REG[op_regA(ir)]} - ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = REG[op_regA(ir)] - REG[op_regB(ir)]
        break
      case OP['AND']:
        console.log(`AND: write ${REG[op_regA(ir)]} & ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = REG[op_regA(ir)] & REG[op_regB(ir)]
        break
      case OP['OR']:
        console.log(`OR: write ${REG[op_regA(ir)]} | ${REG[op_regB(ir)]} to register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = REG[op_regA(ir)] | REG[op_regB(ir)]
        break
      case OP['SL']:
        console.log(`SL: shift left register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = REG[op_regA(ir)] << 1
        break
      case OP['SR']:
        console.log(`SR: shift right register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = REG[op_regA(ir)] >> 1
        break
      case OP['SRA']:
        console.log(`SRA: shift right arithmetic register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = (REG[op_regA(ir)] & 0x8000) | (REG[op_regA(ir)] >> 1)
        break
      case OP['LDL']:
        REG[op_regA(ir)] = (REG[op_regA(ir)] & 0xff00) | (op_data(ir) & 0x00ff)
        console.log(`LDL: load value low (${(REG[op_regA(ir)] & 0xff00) | (op_data(ir) & 0x00ff)}) to register[${op_regA(ir)}]`)
        break
      case OP['LDH']:
        REG[op_regA(ir)] = (op_data(ir) << 8) | (REG[op_regA(ir)] & 0x00ff)
        console.log(`LDH: load value high (${(op_data(ir) << 8) | (REG[op_regA(ir)] & 0xff)}) to register[${op_regA(ir)}]`)
        break
      case OP['CMP']:
        console.log(`CMP: compare ${REG[op_regA(ir)]} and ${REG[op_regB(ir)]}`)
        flag_eq = (REG[op_regA(ir)] === REG[op_regB(ir)]) ? 1 : 0
        break
      case OP['JE']:
        console.log(`JE: jump to ${op_addr(ir)} if flag is true, flag = ${flag_eq === 1}`)
        if (flag_eq === 1) pc = op_addr(ir)
        break
      case OP['JMP']:
        console.log(`JMP: jump to ${op_addr(ir)}`)
        pc = op_addr(ir)
        break
      case OP['LD']:
        console.log(`LD: load ${RAM[op_regA(ir)]} to register[${op_regA(ir)}]`)
        REG[op_regA(ir)] = RAM[op_addr(ir)]
        break
      case OP['ST']:
        console.log(`ST: store ${REG[op_regA(ir)]} to ram[${op_addr(ir)}]`)
        RAM[op_addr(ir)] = REG[op_regA(ir)]
        break
      default:
        break
    }
  }
  console.log('HLT')
  return RAM[64]
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
