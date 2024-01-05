import image from '../../images/no_poster/no_poster.jpg';
import { getMovieById } from '../api/api-service';
import { genresGalleryFormatModal } from '../gallery/formatGenres';
import { addMovieToStorage } from '../storage/set-storage';

const movieTitle = modal.querySelector('.modal_title');
const movieVote = modal.querySelector('.vote');
const moviePopularity = modal.querySelector('.popularity');
const movieOriginalTitle = modal.querySelector('.original-title');
const movieGenres = modal.querySelector('.genre');
const movieOverview = modal.querySelector('.modal_description');
const modalImage = modal.querySelector('.modal_image');
const addToWatchedBtn = document.querySelector('.add-to-watched');
const addToQueuedBtn = document.querySelector('.add-to-queue');

export const KEY_WATCHED = 'watched';
export const KEY_QUEUE = 'queue';

export const dataForModal = movieForModal => {
  const {
    id,
    poster_path,
    title,
    vote_average,
    vote_count,
    popularity,
    original_title,
    genres,
    overview,
  } = movieForModal;

  if (poster_path !== null) {
    modalImage.src = `https://image.tmdb.org/t/p/w500/${poster_path}`;
  } else {
    modalImage.src = image;
  }

  movieTitle.textContent = title;

  movieVote.textContent = `${vote_average} / ${vote_count}`;

  moviePopularity.textContent = popularity;

  movieOriginalTitle.textContent = original_title;

  movieGenres.textContent = genresGalleryFormatModal(genres);

  movieOverview.textContent = overview;

  // SET STORAGE

  addToWatchedBtn.addEventListener('click', addToWatched);
  addToQueuedBtn.addEventListener('click', addToQueue);

  function addToWatched() {
    const movie = id;
    addMovieToStorage(KEY_WATCHED, movie);
  }

  function addToQueue() {
    const movie = id;
    addMovieToStorage(KEY_QUEUE, movie);
  }
};

// ============================

export async function openModal(e) {
  const currentMovieId = e.target.id;
  const movieForModal = await getMovieById(currentMovieId);
  dataForModal(movieForModal);
  modal.style.display = 'block';
  document.body.classList.add('stop-scrolling');
}

export function closeModal() {
  modal.style.display = 'none';
  document.body.classList.remove('stop-scrolling');
  modalImage.src = '';
}
