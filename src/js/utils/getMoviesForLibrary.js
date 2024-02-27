import { getMovieById } from "../api/api-service";
import { createGallery } from "./createGallery";

export const getMoviesForLibrary = (array) => {
  array.map((id) => {
    getMovieById(id).then((data) => {
      const arrData = [];
      arrData.push(data);

      createGallery(arrData);
    });
  });
};
