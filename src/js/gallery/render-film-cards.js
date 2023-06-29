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

getTrending(1)
  .then(data => {
    console.log(data)
    homeBtn.classList.add('current');
    homeBtn.setAttribute("data", "current");
    linksWatchedQueu.style.display = 'none';

    onLoadSpiner();

    galleryfilms.insertAdjacentHTML(
      'beforeend',
      createGalleryMarkup(data.results)
    );
    Loading.remove();
  })
  
    galleryfilms.addEventListener('click', openModal);

    async function openModal(e) {
      const currentMovieId = e.target.id;
      modal.style.display = 'block';
      document.body.classList.add('stop-scrolling');

      const movieForModal = await getMovieById(currentMovieId);

      // DATA FOR MODAL

      modal.querySelector(
        '.modal_image'
      ).src = `https://image.tmdb.org/t/p/w500/${movieForModal.poster_path}`;

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
  modal.querySelector('.modal_image').src = ``;
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
  const uniIdsInStorage = arrayAllStorage.filter(
    (movie, index, arr) => arr.indexOf(movie) === index
  );
  
  uniIdsInStorage.map(id => {
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

// console.log(pagination);

// /*Library Watched*/

// addWatchedBtn.addEventListener('click', addToWatched);

// function addToWatched() {
//   modalEl.style.display = 'none';
//   addToWatchedQueueLS(movieId);

//   renderWatched();
// };

// function addToWatchedQueueLS(movieId) {
//   if (checkIfWatched(movieId)) {
//     watchedMoviesIds = watchedMoviesIds.filter(id => id !== movieId);

//   } else {
//     watchedMoviesIds.push(movieId);
//   }

//   localStorage.setItem('watched', JSON.stringify(watchedMoviesIds));
// }

// function checkIfWatched(movieId) {
//   return watchedMoviesIds.includes(movieId);
// }

// libraryWatchedHeaderBtn.addEventListener('click', renderWatched);

// async function renderWatched () {
//     libraryfilm.innerHTML = '';

//     if(watchedMoviesIds.length) {
//       try {
//         for (const id of watchedMoviesIds) {
//           const movie = await getMovieById(id);
//           watchedMoviesInfo.push(movie);
//         }

//         const layout = createGalleryMarkup(watchedMoviesInfo);
//         libraryfilm.insertAdjacentHTML('beforeend', layout);
//       } catch (error) {
//         // error handling
//       }

//       const allCards = libraryfilm.querySelectorAll('.film__card');
//       allCards.forEach(card => card.addEventListener('click', async () => {
//         modalEl.style.display = 'block';
//         movieId = card.dataset.film;

//         const movieInfo = await getMovieById(movieId);

//        const movieTitleContainer = modalEl.querySelector('.modal_title');
//        movieTitleContainer.textContent = movieInfo.original_title;

//        modalEl.querySelector(
//          '.modal_image'
//        ).src = `https://image.tmdb.org/t/p/w500/${movieInfo.poster_path}`;

//        const movieVote = modalEl.querySelector('.vote');
//        movieVote.textContent = `${movieInfo.vote_average} / ${movieInfo.vote_count}`;

//        const moviePopularity = modalEl.querySelector('.popularity');
//        moviePopularity.textContent = movieInfo.popularity;

//        const movieOriginalTitle = modalEl.querySelector('.original-title');
//        movieOriginalTitle.textContent = movieInfo.original_title;

//        const genres = genresGalleryFormatModal(movieInfo.genre_ids);
//        const movieGenres = modalEl.querySelector('.genre');
//        movieGenres.textContent = genres;

//        const movieOverview = modalEl.querySelector('.modal_description');
//        movieOverview.textContent = movieInfo.overview;
//       }))
//     } else {
//       libraryfilm.innerHTML = '<h2> No movies watched </h2> ';
//     }
//   };

// function setWatchedIds () {
//   if (localStorage.getItem('watched')) {
//     return JSON.parse(localStorage.getItem('watched'));
//   } else {
//     return [];
//   }
// }

// addQueueBtn.addEventListener('click', addToQueue);

// function addToQueue() {
//   modalEl.style.display = 'none';
//   addToQueueLS(movieId);

//   renderQueue();
// }

// function addToQueueLS(movieId) {
//   if (checkIfQueue(movieId)) {
//     queueMoviesIds = queueMoviesIds.filter(id => id !== movieId);
//   } else {
//     queueMoviesIds.push(movieId);
//   }

//   localStorage.setItem('queue', JSON.stringify(queueMoviesIds));
// }

// function checkIfQueue(movieId) {
//   return queueMoviesIds.includes(movieId);
// }

// libraryQueueHeaderBtn.addEventListener('click', renderQueue);

// async function renderQueue() {
//   libraryfilm.innerHTML = '';

//   if (queueMoviesIds.length) {
//     try {
//       for (const id of queueMoviesIds) {
//         const movie = await getMovieById(id);
//         queueMoviesInfo.push(movie);
//       }

//       const layout = createGalleryMarkup(queueMoviesInfo);
//       libraryfilm.insertAdjacentHTML('beforeend', layout);
//     } catch (error) {
//       // error handling
//     }

//     const allCards = libraryfilm.querySelectorAll('.film__card');
//     allCards.forEach(card =>
//       card.addEventListener('click', async () => {
//         modalEl.style.display = 'block';
//         movieId = card.dataset.film;

//         const movieInfo = await getMovieById(movieId);

//         const movieTitleContainer = modalEl.querySelector('.modal_title');
//         movieTitleContainer.textContent = movieInfo.original_title;
//       })
//     );
//   } else {
//     libraryfilm.innerHTML = '<h2> No movies in queue </h2> ';
//   }
// }

// function setQueueIds() {
//   if (localStorage.getItem('queue')) {
//     return JSON.parse(localStorage.getItem('queue'));
//   } else {
//     return [];
//   }
// }

// import { getTrending } from '../api/api-service';
// import { createGalleryMarkup } from '../gallery/galleryMarkupCards';
// import refs from '../refs';

// getTrending().then(data => {
//   refs.galleryfilm.insertAdjacentHTML(
//     'beforeend',
//     createGalleryMarkup(data.results)
//   );
// });
