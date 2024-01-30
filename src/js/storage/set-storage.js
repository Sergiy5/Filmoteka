import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { KEY_QUEUE, KEY_WATCHED } from './keysForStorage';


export function addMovieToStorage(key, keyForFilter, movie) {
  const ifStorage = localStorage.getItem(key)
  const storage = ifStorage === null ? undefined : JSON.parse(ifStorage);

  console.log('movie', movie);
  
  if (!storage) {
    const newStorage = [];
    newStorage.push(movie);
    return localStorage.setItem(key, JSON.stringify(newStorage));
  } 

    const newElem = storage.find(item => item === movie);
  if (!newElem) {
    storage.unshift(movie);
    // filteredStorage(keyForFilter, movie); 
    return localStorage.setItem(key, JSON.stringify(storage));
    
  }
    return notifyForStorage(key);
    
}

// Filtering storage ====================
const filteredStorage = (keyFilter, id) => {
  const storage = localStorage.getItem(keyFilter);
  const storageParsed = storage === null ? undefined : JSON.parse(storage);
  console.log(storageParsed);
  if (storage) {
  const filterStorage = storageParsed.filter(item => item === id);
  localStorage.setItem(keyFilter, JSON.stringify(filterStorage));  
  }
};

// Notify info============================
const notifyForStorage =(key) => {
Notify.info(`The movie already exist in ${key.toUpperCase()}`, {
  width: '280px',
  showOnlyTheLastOne: true,
  clickToClose: true,
});
}