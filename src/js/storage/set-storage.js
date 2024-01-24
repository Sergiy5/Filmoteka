import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { KEY_QUEUE, KEY_WATCHED } from './keysForStorage';

export function addMovieToStorage(key, movie) {

  const ifStorage = localStorage.getItem(key);
  const storage = ifStorage === null ? undefined : JSON.parse(ifStorage);

  if (!storage) {
    const newStorage = [];
    newStorage.push(movie);
    return localStorage.setItem(key, JSON.stringify(newStorage));
  }
  const newElem = storage.find(item => item === movie);

  if (!newElem) {
    storage.unshift(movie);
    return localStorage.setItem(key, JSON.stringify(storage));
  }
  
  Notify.info(`The movie already exist in ${key.toUpperCase()}`, {
    width: '280px',
    showOnlyTheLastOne: true,
    clickToClose: true,
  });
  
}
