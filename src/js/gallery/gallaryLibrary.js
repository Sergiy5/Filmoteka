import { getStorage } from "../storage";
import { clearGallery, getMoviesForLibrary, loaderRemove, moviesPerPage, onLoadSpiner, pagination } from "../utils";
import { KEY_QUEUE, KEY_WATCHED } from "../storage/keysForStorage";


const libraryBtn = document.querySelector(".js-show__library");
const homeBtn = document.querySelector(".js-show__home");
const serchForm = document.querySelector(".js-show");
const linksWatchedQueu = document.querySelector(".header__user-links-wrapper");
const watchedHeaderBtn = document.querySelector(".js-watched");
const queueHeaderBtn = document.querySelector(".js-queue");

// Show library==========================================

libraryBtn.addEventListener("click", onShowLibrary);

export function onShowLibrary(e) {
  e.preventDefault();
  onLoadSpiner();

  pagination.reset();

  libraryBtn.classList.add("current");
  libraryBtn.setAttribute("data", "current");
  homeBtn.classList.remove("current");
  homeBtn.setAttribute("data", "");
  serchForm.style.display = "none";
  linksWatchedQueu.style.display = "flex";

  clearGallery();

  const watchedStorage = getStorage(KEY_WATCHED);
  const qeueStorage = getStorage(KEY_QUEUE);
  const page = 1;

  const arrayAllStorage = [...watchedStorage, ...qeueStorage];
  const arrIdForPage = moviesPerPage(arrayAllStorage, 6, page );

  getMoviesForLibrary(arrIdForPage);
  loaderRemove();
}

export default pagination.on("beforeMove", (e) => {
  const page = e.page;
  if (libraryBtn.getAttribute("data", "current")) {
    const watchedStorage = getStorage(KEY_WATCHED);
    const qeueStorage = getStorage(KEY_QUEUE);

    const arrayAllStorage = [...watchedStorage, ...qeueStorage];
    const arrForPage = moviesPerPage(arrayAllStorage, 6, page);
    getMoviesForLibrary(arrForPage);
  }
  loaderRemove();
});

// Show movies in watched or queue =========================

watchedHeaderBtn.addEventListener("click", showMovieInWatched);
queueHeaderBtn.addEventListener("click", showMovieInQeue);

export function showMovieInWatched(e, page=1) {
  e.preventDefault();
  onLoadSpiner();
  clearGallery();
  pagination.reset();

  const idFromQueue = getStorage(KEY_WATCHED);
  const arrForPage = moviesPerPage(idFromQueue, 6, page);

  getMoviesForLibrary(arrForPage);
  loaderRemove();
}

export function showMovieInQeue(e, page=1) {
  e.preventDefault();
  onLoadSpiner();
  clearGallery();
  pagination.reset();
  // const page = 1;

  const idFromWatched = getStorage(KEY_QUEUE);
  const arrForPage = moviesPerPage(idFromWatched, 6, page);

  getMoviesForLibrary(arrForPage);
  loaderRemove();
}
