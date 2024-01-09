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
const backdrop = document.querySelector('.modal__backdrop');
const galleryfilms = document.querySelector('.list-films-js');
const closeModalBtn = document.querySelector('.modal__button');

export const KEY_WATCHED = 'watched';
export const KEY_QUEUE = 'queue';

// Open modal===========================================
galleryfilms.addEventListener('click', openModal);

export async function openModal(e) {
  const currentMovieId = e.target.id;
  const movieForModal = await getMovieById(currentMovieId);
  dataForModal(movieForModal);
  modal.style.display = 'block';
  document.body.classList.add('stop-scrolling');
}

// Close modal==========================================
closeModalBtn.addEventListener('click', closeModal);

export function closeModal() {
  modal.style.display = 'none';
  document.body.classList.remove('stop-scrolling');
  modalImage.src = '';
}

window.addEventListener('keydown', e => {
  if (e.keyCode === 27) {
    closeModal();
  }
});

window.addEventListener('click', e => {
  if (e.target === backdrop) {
    closeModal();
  }
});

// Data for modal==========================================
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

  // Set to storage (Watched and Queue)==================================================

  addToWatchedBtn.addEventListener('click', () => addMovieToStorage(KEY_WATCHED, id));
  addToQueuedBtn.addEventListener('click', () => addMovieToStorage(KEY_QUEUE, id));
};
