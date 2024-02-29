import { getStorage } from "../storage";
import {
  clearGallery,
  getMoviesForLibrary,
  loaderRemove,
  moviesPerPage,
  onLoadSpiner,
  pagination,
} from "../utils";
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
  const arrIdForPage = moviesPerPage(arrayAllStorage, 6, page);

  getMoviesForLibrary(arrIdForPage);
  loaderRemove();
}

pagination.on("beforeMove", (e) => {
  const page = e.page;
  const isLibraryCurrent= libraryBtn.getAttribute("data", "current")
  const isWatchedCurrent = watchedHeaderBtn.classList.contains("current__library")
  const isQueueCurrent = queueHeaderBtn.classList.contains("current__library")

  if (isLibraryCurrent) {
    const watchedStorage = getStorage(KEY_WATCHED);
    const qeueStorage = getStorage(KEY_QUEUE);

    const arrayAllStorage = [...watchedStorage, ...qeueStorage];
    const arrForPage = moviesPerPage(arrayAllStorage, 6, page);
    getMoviesForLibrary(arrForPage);
  }
  if (isWatchedCurrent) {
    showMovieInWatched(e, page);
  }
  if (isQueueCurrent) {
    showMovieInQeue(e, page);
  }
  loaderRemove();
});

// Show movies in watched or queue =========================

const addAndRemoveClassCurrent = (e) => {
  const key = e.target.getAttribute("data-current");

  switch (key) {
    case "watched":
      queueHeaderBtn.classList.remove("current__library");
      watchedHeaderBtn.classList.add("current__library");

      break;
    case "queue":
      watchedHeaderBtn.classList.remove("current__library");
      queueHeaderBtn.classList.add("current__library");

      break;

    default:
      console.log(e);
      break;
  }
};

watchedHeaderBtn.addEventListener("click", addAndRemoveClassCurrent);
queueHeaderBtn.addEventListener("click", addAndRemoveClassCurrent);
// showMovieInWatched;showMovieInQeue

export function showMovieInWatched(e, page = 1) {
  e.preventDefault();
  onLoadSpiner();
  clearGallery();
  pagination.reset();

  const idFromQueue = getStorage(KEY_WATCHED);
  const arrForPage = moviesPerPage(idFromQueue, 6, page);

  getMoviesForLibrary(arrForPage);
  loaderRemove();
}

export function showMovieInQeue(e, page = 1) {
  e.preventDefault();
  onLoadSpiner();
  clearGallery();
  pagination.reset();

  const idFromWatched = getStorage(KEY_QUEUE);
  const arrForPage = moviesPerPage(idFromWatched, 6, page);

  getMoviesForLibrary(arrForPage);
  loaderRemove();
}
