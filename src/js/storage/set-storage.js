import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function addMovieToStorage(key, movie) {

  const checkStorage = localStorage.getItem(key);
  const storage = checkStorage === null ? undefined : JSON.parse(checkStorage);

  if (!storage) {
    const newStorage = [];
    newStorage.push(movie);
    return localStorage.setItem(key, JSON.stringify(newStorage));
  }
  const newElem = storage.find(item => item === movie);

  if (!newElem) {
    storage.push(movie);
    return localStorage.setItem(key, JSON.stringify(storage));
  }
  
  // Notify.info(`The movie already exist in ${key.toUpperCase()}`, { width: '280px' });
}
