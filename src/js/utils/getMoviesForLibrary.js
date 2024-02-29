import { getMovieById } from "../api/api-service";
import { KEY_QUEUE, KEY_WATCHED, getStorage } from "../storage";
import { clearGallery } from "./clearGallery";
import { createGallery } from "./createGallery";
import { loaderRemove, onLoadSpiner } from "./loader";
import { moviesPerPage } from "./moviesPerPage";
import { pagination } from "./pagination";
import refs from "../refs";
const { watchedBtn, queueBtn } = refs;

export const getMoviesForLibrary = (array) => {
  array.map((id) => {
    getMovieById(id).then((data) => {
      const arrData = [];
      arrData.push(data);

      createGallery(arrData);
    });
  });
};

// Show movies from storage watched

export function showMovieInWatched(page) {
  onLoadSpiner();

  clearGallery();
  pagination.reset();

  const idFromQueue = getStorage(KEY_WATCHED);
  const arrForPage = moviesPerPage(idFromQueue, 6, page);

  getMoviesForLibrary(arrForPage);
  loaderRemove();
}

// Show movies from storage queue

export function showMovieInQeue(page) {
  onLoadSpiner();

  clearGallery();
  pagination.reset();

  const idFromWatched = getStorage(KEY_QUEUE);
  const arrForPage = moviesPerPage(idFromWatched, 6, page);

  getMoviesForLibrary(arrForPage);
  loaderRemove();
}
