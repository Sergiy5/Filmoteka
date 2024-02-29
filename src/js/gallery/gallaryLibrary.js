import { getStorage } from "../storage";
import {
  clearGallery,
  getMoviesForLibrary,
  showMovieInWatched,
  showMovieInQeue,
  loaderRemove,
  moviesPerPage,
  onLoadSpiner,
  pagination,
} from "../utils";
import { KEY_QUEUE, KEY_WATCHED } from "../storage/keysForStorage";
import { toggleClassCurrent } from './toggleClassCurrent';
import refs from '../refs';

const { watchedBtn, queueBtn, libraryBtn, homeBtn } = refs;
const serchForm = document.querySelector(".js-show");
const linksWatchedQueu = document.querySelector(".header__user-links-wrapper");





// Show library ==========================================

libraryBtn.addEventListener("click", onShowLibrary);

export function onShowLibrary(e) {
  e.preventDefault();
  onLoadSpiner();

  pagination.reset();

  homeBtn.classList.remove("current");
  queueBtn.classList.remove("current__library");
  watchedBtn.classList.remove("current__library");
  libraryBtn.setAttribute("data", "current");
  homeBtn.setAttribute("data", "");
  libraryBtn.classList.add("current");
  serchForm.style.display = "none";
  linksWatchedQueu.style.display = "flex";

  clearGallery();

  // Add Event Listener on buttons watched, queue ===========================
  watchedBtn.addEventListener("click", toggleClassCurrent);
  queueBtn.addEventListener("click", toggleClassCurrent);

  const watchedStorage = getStorage(KEY_WATCHED);
  const qeueStorage = getStorage(KEY_QUEUE);
  const page = 1;

  const arrayAllStorage = [...watchedStorage, ...qeueStorage];
  const arrIdForPage = moviesPerPage(arrayAllStorage, 6, page);

  getMoviesForLibrary(arrIdForPage);
  loaderRemove();
}

// Pagination library

pagination.on("beforeMove", (e) => {
   const page = e.page
  const isWatchedCurrent =
    watchedBtn.classList.contains("current__library");
  const isQueueCurrent = queueBtn.classList.contains("current__library");
  
  if (!isWatchedCurrent && !isQueueCurrent) {
    const watchedStorage = getStorage(KEY_WATCHED);
    const qeueStorage = getStorage(KEY_QUEUE);

    const arrayAllStorage = [...watchedStorage, ...qeueStorage];
    const arrForPage = moviesPerPage(arrayAllStorage, 6, page);
    getMoviesForLibrary(arrForPage);
  }
  if (isWatchedCurrent) {
    showMovieInWatched(page);
  }
  if (isQueueCurrent) {
    showMovieInQeue(page);
  }
  loaderRemove();
});


