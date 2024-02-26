import { Loading } from "notiflix/build/notiflix-loading-aio";
import { pagination } from "../components/pagination";
import { getTrending } from "../api/api-service";
import { createGalleryMarkup } from "../gallery/galleryMarkupCards";
import { getMovieById } from "../api/api-service";
import { movieOnSearch } from "../api/api-service";
import { KEY_QUEUE, KEY_WATCHED } from "../storage/keysForStorage";
import { getStorage } from "../storage";
import { moviesPerPage } from "../utils/moviesPerPage";

const libraryBtn = document.querySelector(".js-show__library");
const homeBtn = document.querySelector(".js-show__home");
const serchForm = document.querySelector(".js-show");
const linksWatchedQueu = document.querySelector(".header__user-links-wrapper");
const watchedHeaderBtn = document.querySelector(".js-watched");
const queueHeaderBtn = document.querySelector(".js-queue");
const galleryfilms = document.querySelector(".list-films-js");
const searchForm = document.querySelector(".header__search-form");

// Home page ==============================

getTrending(1).then(({ results }) => {
  onLoadSpiner();
  homeBtn.classList.add("current");
  homeBtn.setAttribute("data", "current");
  linksWatchedQueu.style.display = "none";

  const arrData = moviesPerPage(results, 6, (page = 1));
  galleryfilms.insertAdjacentHTML("beforeend", createGalleryMarkup(arrData));
  Loading.remove();
});

// Pagination home =========================
pagination.on("beforeMove", (e) => {
  onLoadSpiner();
  galleryfilms.innerHTML = "";
  const page = e.page ?? 1;
  let getPage = 1
  if (e.page % 4 === 0) return getPage+=4
    
    
        getTrending(page).then(({ results }) => {
          const arrData = moviesPerPage(results, 6, page);

          galleryfilms.insertAdjacentHTML(
            "beforeend",
            createGalleryMarkup(arrData)
          );
          Loading.remove();
        });
    
  

  // if (homeBtn.getAttribute("data", "current")) {
  // }
});

// Show library==========================================

libraryBtn.addEventListener("click", onShowLibrary);

function onShowLibrary(e) {
  e.preventDefault();
  onLoadSpiner();

  pagination.reset();

  libraryBtn.classList.add("current");
  libraryBtn.setAttribute("data", "current");
  homeBtn.classList.remove("current");
  homeBtn.setAttribute("data", "");
  serchForm.style.display = "none";
  linksWatchedQueu.style.display = "flex";

  galleryfilms.innerHTML = "";
  const watchedStorage = getStorage(KEY_WATCHED);
  const qeueStorage = getStorage(KEY_QUEUE);

  const arrayAllStorage = [...watchedStorage, ...qeueStorage];
  const arrForPage = moviesPerPage(arrayAllStorage, 6, (page = 1));
  arrForPage.map((id) => {
    getMovieById(id).then((data) => {
      const arrData = [];
      arrData.push(data);

      galleryfilms.insertAdjacentHTML(
        "beforeend",
        createGalleryMarkup(arrData)
      );
    });
  });
  Loading.remove();
}

pagination.on("beforeMove", (e) => {
  const page = e.page ?? 1;

  if (libraryBtn.getAttribute("data", "current")) {
    const watchedStorage = getStorage(KEY_WATCHED);
    const qeueStorage = getStorage(KEY_QUEUE);

    const arrayAllStorage = [...watchedStorage, ...qeueStorage];
    const arrForPage = moviesPerPage(arrayAllStorage, 6, page);

    arrForPage.map((id) => {
      getMovieById(id).then((data) => {
        const arrData = [];
        arrData.push(data);

        galleryfilms.insertAdjacentHTML(
          "beforeend",
          createGalleryMarkup(arrData)
        );
      });
    });
  }
  Loading.remove();
});

// Show movies in watched or queue =========================

watchedHeaderBtn.addEventListener("click", showMovieInWatched);
queueHeaderBtn.addEventListener("click", showMovieInQeue);

function showMovieInWatched(e) {
  e.preventDefault();

  onLoadSpiner();

  galleryfilms.innerHTML = "";

  const arrStorage = getStorage(KEY_WATCHED);

  arrStorage.map((id) => {
    getMovieById(id).then((data) => {
      const arrData = [];
      arrData.push(data);

      galleryfilms.insertAdjacentHTML(
        "beforeend",
        createGalleryMarkup(arrData)
      );
    });
  });
  Loading.remove();
}

function showMovieInQeue(e) {
  e.preventDefault();
  onLoadSpiner();
  galleryfilms.innerHTML = "";
  const idInWatched = getStorage(e, KEY_QUEUE);
  idInWatched.map((id) => {
    getMovieById(id).then((data) => {
      const arrData = [];
      arrData.push(data);
      galleryfilms.insertAdjacentHTML(
        "beforeend",
        createGalleryMarkup(arrData)
      );
    });
  });
  Loading.remove();
}

// Search movie============================================

searchForm.addEventListener("submit", searchMovie);

function searchMovie(e) {
  e.preventDefault();
  onLoadSpiner();
  galleryfilms.innerHTML = "";
  const query = e.currentTarget.elements.query.value;
  movieOnSearch(query).then((response) => {
    galleryfilms.insertAdjacentHTML(
      "beforeend",
      createGalleryMarkup(response.results)
    );
    Loading.remove();
  });
}

function onLoadSpiner() {
  Loading.pulse({ clickToClose: true, svgSize: "100px" });
}
