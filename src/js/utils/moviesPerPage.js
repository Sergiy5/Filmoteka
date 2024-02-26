export const moviesPerPage = (moviesArray, quantityOnPage, page = 1) => {
  const quantity = page * quantityOnPage;
  if (page === 1) {
    const sliceArr = moviesArray.slice(0, quantity);
    return sliceArr
  }
  else {
    const firstEl = quantityOnPage * (page - 1);
    const lastEl = quantityOnPage * page;
    const sliceArr = moviesArray.slice(firstEl, lastEl);
    return sliceArr;
  }
};
