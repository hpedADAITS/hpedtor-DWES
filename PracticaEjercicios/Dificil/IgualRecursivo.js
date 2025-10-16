function equalTypeCompare(a, b) {
  if (a === b) return true;

  if (typeof a !== 'object' || a === null ||
      typeof b !== 'object' || b === null) {
    return false;
  }

  const claveA = Object.keys(a);
  const claveB = Object.keys(b);

  if (claveA.length !== claveB.length) return false;

  for (const key of claveA) {
    if (!claveB.includes(key) || !equalTypeCompare(a[key], b[key])) {
      return false;
    }
  }
  return true;
}
