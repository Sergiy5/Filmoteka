import { getMovieById } from '../api/api-service';
import { genresGalleryFormatModal } from '../gallery/formatGenres';
import { KEY_QUEUE, KEY_WATCHED } from '../storage/keysForStorage';
import { addMovieToStorage, checkMovie } from '../storage/set-storage';
import image from '../../images/no_poster/No-Image.jpg';
import { modalRefs } from './modalRefs';

const {
  movieTitle,
  movieVote,
  moviePopularity,
  movieOriginalTitle,
  movieGenres,
  movieOverview,
  modalImage,
  addToWatchedBtn,
  addToQueueBtn,
  backdrop,
  galleryfilms,
  closeModalBtn,
  modal__window,
} = modalRefs;

// Open modal===========================================

galleryfilms.addEventListener('click', openModal);

export async function openModal(e) {
  const currentMovieId = e.target.id;
  const movieForModal = await getMovieById(currentMovieId);

  dataForModal(movieForModal);
  modal.style.display = 'block';
  document.body.classList.add('stop-scrolling');
}

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
  // ====================
  console.log(id);
  // ====================
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

  const addWAtch = () => {};

  // Set to storage (Watched and Queue)==================================================
  addToWatchedBtn.addEventListener(
    'click',
    () => {
      addMovieToStorage(KEY_WATCHED, KEY_QUEUE, id);
    },
    { once: true }
  );

  addToQueueBtn.addEventListener('click', () =>
    addMovieToStorage(KEY_QUEUE, KEY_WATCHED, id)
  );
};

// Close modal==========================================
closeModalBtn.addEventListener('click', closeModal);

export function closeModal() {
  addToWatchedBtn.removeEventListener('click', addMovieToStorage);
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
