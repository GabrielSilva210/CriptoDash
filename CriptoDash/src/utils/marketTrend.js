// O CoinGecko gratuito não tem histórico do market cap global. Então a
// tendência é aproximada somando (preço × oferta circulante) das 100 maiores
// moedas em cada ponto dos últimos 7 dias (um ponto por hora, ~168 pontos).
export function buildMarketCapTrend(coins) {
  const size = coins[0]?.sparkline_in_7d?.price?.length
  if (!size) return null

  const series = coins.filter(
    (coin) =>
      coin.circulating_supply &&
      coin.sparkline_in_7d?.price?.length === size,
  )

  return Array.from({ length: size }, (_, i) =>
    series.reduce(
      (sum, coin) => sum + coin.sparkline_in_7d.price[i] * coin.circulating_supply,
      0,
    ),
  )
}
