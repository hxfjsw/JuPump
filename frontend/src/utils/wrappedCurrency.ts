import {
  ChainId,
  Currency,
  ETHER,
  Token,
  CurrencyAmount,
  // wrappedCurrency as wrappedCurrencyInternal,
  wrappedCurrencyAmount as wrappedCurrencyAmountInternal,
  WETH9,
} from '@uniswap/sdk-core'
import { supportedChainId } from './supportedChainId'

export function wrappedCurrencyInternal(currency: Currency, chainId: ChainId): Token {
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

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && currency ? wrappedCurrencyInternal(currency, chainId) : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount<Currency> | undefined,
  chainId: ChainId | undefined
): CurrencyAmount<Token> | undefined {
  return currencyAmount && chainId ? wrappedCurrencyAmountInternal(currencyAmount, chainId) : undefined
}

export function unwrappedToken(token: Token): Currency {
  if (token.isEther) return token
  const formattedChainId = supportedChainId(token.chainId)
  if (formattedChainId && token.equals(WETH9[formattedChainId])) return ETHER
  return token
}
