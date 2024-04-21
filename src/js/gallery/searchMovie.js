import { movieOnSearch } from "../api/api-service";
import { clearGallery, createGallery, loaderRemove, onLoadSpiner } from "../utils";

const searchForm = document.querySelector(".header__search-form");

// Search movie ============================================

searchForm.addEventListener("submit", searchMovie);

export async function searchMovie(e) {
  e.preventDefault();
  onLoadSpiner();
  clearGallery();
  const query = e.currentTarget.elements.query.value;
  const { results } = await movieOnSearch(query);

  createGallery(results);

  loaderRemove();
}