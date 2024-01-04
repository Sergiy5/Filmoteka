import { Notify } from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { getTrending } from '../api/api-service';
import { createGalleryMarkup } from '../gallery/galleryMarkupCards';
import { createLibraryMarkup } from '../gallery/libraryMarkupCards';
import { genresGalleryFormatModal } from './formatGenres';
import { getMovieById } from '../api/api-service';
import { movieOnSearch } from '../api/api-service';
import { addMovieToStorage } from '../storage/set-storage';
import { getStorage } from '../storage/get-storage';
import { instance } from '../components/pagination';

const KEY_WATCHED = 'watched';
const KEY_QUEUE = 'queue';
const modal = document.querySelector('.modal');
const libraryBtn = document.querySelector('.js-show__library');
const homeBtn = document.querySelector('.js-show__home');
const serchForm = document.querySelector('.js-show');
const linksWatchedQueu = document.querySelector('.header__user-links-wrapper');
const addToWatchedBtn = document.querySelector('.add-to-watched');
const addToQueuedBtn = document.querySelector('.add-to-queue');
const watchedHeaderBtn = document.querySelector('.js-watched');
const queueHeaderBtn = document.querySelector('.js-queue');
const galleryfilms = document.querySelector('.list-films-js');
const closeModalBtn = document.querySelector('.modal__button');
const searchForm = document.querySelector('.header__search-form');
const backdrop = document.querySelector('.modal__backdrop');

instance.on('beforeMove', evt => {
  onLoadSpiner();
  galleryfilms.innerHTML = '';
  const pagiPage = evt.page;
  const page = pagiPage ?? 1;
  if (homeBtn.getAttribute('data', 'current')) {
    getTrending(page).then(data => {
      homeBtn.classList.add('current');
      homeBtn.setAttribute('data', 'current');
      linksWatchedQueu.style.display = 'none';
      galleryfilms.insertAdjacentHTML(
        'beforeend',
        createGalleryMarkup(data.results)
      );
      Loading.remove();
    });
  }
});

getTrending(1).then(data => {
  homeBtn.classList.add('current');
  homeBtn.setAttribute('data', 'current');
  linksWatchedQueu.style.display = 'none';

  onLoadSpiner();

  galleryfilms.insertAdjacentHTML(
    'beforeend',
    createGalleryMarkup(data.results)
  );
  Loading.remove();
});

galleryfilms.addEventListener('click', openModal);

async function openModal(e) {
  const currentMovieId = e.target.id;
  modal.style.display = 'block';
  document.body.classList.add('stop-scrolling');
  
  // DATA FOR MODAL======================

  const movieForModal = await getMovieById(currentMovieId);

  if (movieForModal.poster_path !== null){
    modal.querySelector(
      '.modal_image'
    ).src = `https://image.tmdb.org/t/p/w500/${movieForModal.poster_path}`;
  } 
  console.log('modal',modal.querySelector('.modal_image').src);
  
  const movieTitle = modal.querySelector('.modal_title');
  movieTitle.textContent = movieForModal.title;

  const movieVote = modal.querySelector('.vote');
  movieVote.textContent = `${movieForModal.vote_average} / ${movieForModal.vote_count}`;

  const moviePopularity = modal.querySelector('.popularity');
  moviePopularity.textContent = movieForModal.popularity;

  const movieOriginalTitle = modal.querySelector('.original-title');
  movieOriginalTitle.textContent = movieForModal.original_title;

  const genres = genresGalleryFormatModal(movieForModal.genres);
  const movieGenres = modal.querySelector('.genre');
  movieGenres.textContent = genres;

  const movieOverview = modal.querySelector('.modal_description');
  movieOverview.textContent = movieForModal.overview;

  // SET STORAGE

  addToWatchedBtn.addEventListener('click', addToWatched);
  addToQueuedBtn.addEventListener('click', addToQueue);

  function addToWatched() {
    const movie = movieForModal.id;
    addMovieToStorage(KEY_WATCHED, movie);
  }

  function addToQueue() {
    const movie = movieForModal.id;
    addMovieToStorage(KEY_QUEUE, movie);
  }
}

closeModalBtn.addEventListener('click', closeModal);

function closeModal() {
  modal.style.display = 'none';
  document.body.classList.remove('stop-scrolling');
  modal.querySelector('.modal_image').src = '';
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

libraryBtn.addEventListener('click', onShowLibrary);

function onShowLibrary(e) {
  e.preventDefault();
  onLoadSpiner();

  libraryBtn.classList.add('current');
  libraryBtn.setAttribute('data', 'current');
  homeBtn.classList.remove('current');
  homeBtn.setAttribute('data', '');
  serchForm.style.display = 'none';
  linksWatchedQueu.style.display = 'flex';

  galleryfilms.innerHTML = '';

  const idInWatched = getStorage(e, KEY_WATCHED);
  const idInQeue = getStorage(e, KEY_QUEUE);
  const arrayAllStorage = [...idInWatched, ...idInQeue];

  // Створення масиву з унікальними елементами
  const uniqueIdsInStorage = arrayAllStorage.filter(
    (movie, index, arr) => arr.indexOf(movie) === index
  );

  uniqueIdsInStorage.map(id => {
    getMovieById(id).then(data => {
      const arrData = [];
      arrData.push(data);

      galleryfilms.insertAdjacentHTML(
        'beforeend',
        createGalleryMarkup(arrData)
      );
    });
  });
  Loading.remove();
}

// Рендеринг фільмів 'watched', 'queue'

watchedHeaderBtn.addEventListener('click', showMovieInWatched);
queueHeaderBtn.addEventListener('click', showMovieInQeue);

function showMovieInWatched(e) {
  e.preventDefault();
  onLoadSpiner();
  galleryfilms.innerHTML = '';
  const idInWatched = getStorage(e, KEY_WATCHED);
  idInWatched.map(id => {
    getMovieById(id).then(data => {
      const arrData = [];
      arrData.push(data);
      galleryfilms.insertAdjacentHTML(
        'beforeend',
        createGalleryMarkup(arrData)
      );
    });
  });
  Loading.remove();
}

function showMovieInQeue(e) {
  e.preventDefault();
  onLoadSpiner();
  galleryfilms.innerHTML = '';
  const idInWatched = getStorage(e, KEY_QUEUE);
  idInWatched.map(id => {
    getMovieById(id).then(data => {
      const arrData = [];
      arrData.push(data);
      galleryfilms.insertAdjacentHTML(
        'beforeend',
        createGalleryMarkup(arrData)
      );
    });
  });
  Loading.remove();
}

// Пошук фільмів з інпуту

searchForm.addEventListener('submit', searchMovie);

function searchMovie(e) {
  e.preventDefault();
  onLoadSpiner();
  galleryfilms.innerHTML = '';
  const query = e.currentTarget.elements.query.value;
  movieOnSearch(query).then(response => {
    galleryfilms.insertAdjacentHTML(
      'beforeend',
      createGalleryMarkup(response.results)
    );
    Loading.remove();
  });
}

function onLoadSpiner() {
  Loading.pulse({ clickToClose: true, svgSize: '100px' });
}
