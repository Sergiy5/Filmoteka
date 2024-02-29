import { getTrending } from "../api/api-service";
import {
  clearGallery,
  createGallery,
  loaderRemove,
  onLoadSpiner,
  pagination,
} from "../utils";
import { toggleClassCurrent } from "./toggleClassCurrent";
import refs from '../refs';

const { watchedBtn, queueBtn } = refs;
const linksWatchedQueu = document.querySelector(".header__user-links-wrapper");
const homeBtn = document.querySelector(".js-show__home");

// Home page ==============================


  getTrending(1).then(({ results }) => {
    onLoadSpiner();
    homeBtn.classList.add("current");
    homeBtn.setAttribute("data", "current");
    linksWatchedQueu.style.display = "none";

    createGallery(results);
// Remove Event Listener ==================
    watchedBtn.removeEventListener("click", toggleClassCurrent);
    queueBtn.removeEventListener("click", toggleClassCurrent);

    loaderRemove();
  })

// Pagination home =========================

pagination.on("beforeMove", (e) => {

  onLoadSpiner();

  clearGallery();

  const page = e.page;

  if (homeBtn.getAttribute("data", "current")) {
    getTrending(page).then(({ results }) => {
      createGallery(results);
    });
  }
  loaderRemove();
});
