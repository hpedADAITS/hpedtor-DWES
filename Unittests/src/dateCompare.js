export function dateCompare(date1, date2) {
  const d1 = new Date(date1);

  if (isNaN(d1.getTime())) {
    throw new Error('Invalid date1');
  }

  const d2 = date2 ? new Date(date2) : new Date();

  if (isNaN(d2.getTime())) {
    throw new Error('Invalid date2');
  }

  if (d1 < d2) {
    return {
      startDate: d1.toISOString(),
      endDate: d2.toISOString(),
    };
  } else {
    return {
      startDate: d2.toISOString(),
      endDate: d1.toISOString(),
    };
  }
}
