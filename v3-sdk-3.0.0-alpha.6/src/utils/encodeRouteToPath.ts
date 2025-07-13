import { pack } from '@ethersproject/solidity'
import { Currency, Token ,ChainId,WETH9} from '@uniswap/sdk-core'
import { Pool } from '../entities/pool'
import { Route } from '../entities/route'

function wrappedCurrency(currency: Currency, chainId: ChainId): Token {
  if (currency.isToken) {
    // invariant(currency.chainId === chainId, 'CHAIN_ID')
    return currency
  }
  if (chainId === 210000) {
    const WJU = new Token(210000, '0x4d1b49b424afd7075d3c063addf97d5575e1c7e2', 18, 'WJU', 'Wrapped JU')
    return WJU
  }
  if (currency.isEther) return WETH9[chainId]
  throw new Error('CURRENCY')
}

/**
 * Converts a route to a hex encoded path
 * @param route the v3 path to convert to an encoded path
 * @param exactOutput whether the route should be encoded in reverse, for making exact output swaps
 */
export function encodeRouteToPath(route: Route<Currency, Currency>, exactOutput: boolean): string {
  const firstInputToken: Token = wrappedCurrency(route.input, route.chainId)

  const { path, types } = route.pools.reduce(
    (
      { inputToken, path, types }: { inputToken: Token; path: (string | number)[]; types: string[] },
      pool: Pool,
      index
    ): { inputToken: Token; path: (string | number)[]; types: string[] } => {
      const outputToken: Token = pool.token0.equals(inputToken) ? pool.token1 : pool.token0
      if (index === 0) {
        return {
          inputToken: outputToken,
          types: ['address', 'uint24', 'address'],
          path: [inputToken.address, pool.fee, outputToken.address]
        }
      } else {
        return {
          inputToken: outputToken,
          types: [...types, 'uint24', 'address'],
          path: [...path, pool.fee, outputToken.address]
        }
      }
    },
    { inputToken: firstInputToken, path: [], types: [] }
  )

  return exactOutput ? pack(types.reverse(), path.reverse()) : pack(types, path)
}
