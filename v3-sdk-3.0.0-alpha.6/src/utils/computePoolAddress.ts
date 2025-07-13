import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/solidity'
import { Token } from '@uniswap/sdk-core'
import { FeeAmount, POOL_INIT_CODE_HASH } from '../constants'

export function computePoolAddress({
  factoryAddress,
  tokenA,
  tokenB,
  fee
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
  fee: FeeAmount
}): string {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  return getCreate2Address(
    factoryAddress,
    keccak256(
      ['bytes'],
      [defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0.address, token1.address, fee])]
    ),
    POOL_INIT_CODE_HASH
  )
}

// const MTK = new Token(2100000,"0x1a180690efd9Aa55550178c548A5548310D500e6",18)
// const WETH9 = new Token(2100000,"0x4d1b49b424afd7075d3c063addf97d5575e1c7e2",18)
// console.log("computePoolAddress",computePoolAddress({factoryAddress:"0xa8eDB7A6922113968896F82302B0E803216E9986",tokenA:MTK,tokenB:WETH9,fee:FeeAmount.HIGH}))