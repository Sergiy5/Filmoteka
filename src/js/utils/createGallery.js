import { createGalleryMarkup } from "../gallery/galleryMarkupCards";

const galleryFilms = document.querySelector(".list-films-js");

export const createGallery = (arrData) => {
  galleryFilms.insertAdjacentHTML("beforeend", createGalleryMarkup(arrData));
};
