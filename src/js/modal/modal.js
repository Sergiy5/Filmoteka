import { getMovieById } from '../api/api-service';
import { genresGalleryFormatModal } from '../gallery';
import { addMovieToStorage, KEY_QUEUE, KEY_WATCHED } from "../storage";
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

if(movieForModal){
  dataForModal(movieForModal);

    modal__window.classList.add("modal-open");

  modal.classList.add("modal-open"); 
  document.body.classList.add('stop-scrolling')};
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
  const saveToQueue = ()=> {
    addMovieToStorage(KEY_QUEUE, KEY_WATCHED, id);
  }
  const saveToWatched = () => {
    addMovieToStorage(KEY_WATCHED, KEY_QUEUE, id);
  };
  
  addToWatchedBtn.addEventListener("click", saveToWatched);
  
  addToQueueBtn.addEventListener("click", saveToQueue);


  // Close modal==========================================
  closeModalBtn.addEventListener('click', closeModal);
  
  function closeModal() {
    addToWatchedBtn.removeEventListener("click", saveToWatched);
    addToQueueBtn.removeEventListener("click", saveToQueue);
    modal.classList.remove("modal-open"); 
    modal__window.classList.remove("modal-open");
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

}

