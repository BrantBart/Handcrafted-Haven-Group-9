
export const PEXELS_API_KEY = '810gLClzwFnFJbARupHfv2anOtVllEuoelDd1SJKTmnzVto9x3TBEsSE';

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function getPexelsUrl(query = 'handcraft', perPage = 15): string {
  return `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}`;
}
