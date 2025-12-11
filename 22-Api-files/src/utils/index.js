const paginationItems = (req, items, offset, limit) => {
  const offsetNum = parseInt(offset, 10);
  const limitNum = parseInt(limit, 10);
  const lastItem = offsetNum + limitNum;
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limitNum);

  const host = req.get("host");
  const sort = req.query.sort ? req.query.sort : "date";
  const filter = req.query.filter ? req.query.filter : "";

  let firstLink = undefined;
  if (offsetNum !== 0) {
    firstLink = `?offset=0&limit=${limitNum}&sort=${sort}&filter=${filter}`;
  }

  let previousLink = undefined;
  if (offsetNum >= limitNum) {
    const prevOffset = offsetNum - limitNum;
    previousLink = `?offset=${prevOffset}&limit=${limitNum}&sort=${sort}&filter=${filter}`;
  }

  let nextLink = undefined;
  if (lastItem < totalItems) {
    nextLink = `?offset=${lastItem}&limit=${limitNum}&sort=${sort}&filter=${filter}`;
  }

  let lastLink = undefined;
  if (offsetNum < totalItems - limitNum) {
    const lastOffset = (totalPages - 1) * limitNum;
    lastLink = `?offset=${lastOffset}&limit=${limitNum}&sort=${sort}&filter=${filter}`;
  }

  const paginatedItems = items.slice(offsetNum, lastItem);

  return {
    links: {
      base: `${host}/api/archivos`,
      first: firstLink,
      previous: previousLink,
      next: nextLink,
      last: lastLink,
    },
    offset: offsetNum,
    limit: limitNum,
    total: totalItems,
    pages: totalPages,
    results: paginatedItems,
  };
};

module.exports = {
  paginationItems,
};
