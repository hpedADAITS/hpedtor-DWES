 function prepareGifts(gifts) {
  const uniqueGifts = new Set(gifts);
  const sortedGifts = Array.from(uniqueGifts).sort((a, b) => a - b);
  return sortedGifts;
}
