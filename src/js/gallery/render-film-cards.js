import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getTrending } from '../api/api-service';
import { createGalleryMarkup } from '../gallery/galleryMarkupCards';
import { createLibraryMarkup } from '../gallery/libraryMarkupCards';
import { getMovieById } from '../api/api-service';
import { movieOnSearch } from '../api/api-service';
import { getStorage } from '../storage/get-storage';
import { instance } from '../components/pagination';
import {
  KEY_QUEUE,
  KEY_WATCHED,
} from '../modal/modal';

const libraryBtn = document.querySelector('.js-show__library');
const homeBtn = document.querySelector('.js-show__home');
const serchForm = document.querySelector('.js-show');
const linksWatchedQueu = document.querySelector('.header__user-links-wrapper');
const watchedHeaderBtn = document.querySelector('.js-watched');
const queueHeaderBtn = document.querySelector('.js-queue');
const galleryfilms = document.querySelector('.list-films-js');
const searchForm = document.querySelector('.header__search-form');

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

// Show library==========================================

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

  // Unic array for library==================================

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

// Show library=============================================

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

// Search movie============================================

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
