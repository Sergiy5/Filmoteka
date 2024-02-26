
export function addMovieToStorage(key, keyStorageFilter, movieId) {

  filteredStorage(keyStorageFilter, movieId);

  const storage = localStorage.getItem(key);

  if (storage === null) {
    const newStorage = [];
    newStorage.push(movieId);
    return localStorage.setItem(key, JSON.stringify(newStorage));
  }

  const parsedStorsge = JSON.parse(storage);
  const onFilterStorage = parsedStorsge.filter((id) => id !== movieId);
  onFilterStorage.unshift(movieId);
  localStorage.setItem(key, JSON.stringify(onFilterStorage));
}

// Filter storage ===================================
const filteredStorage = (keyFilter, id) => {
  const storage = localStorage.getItem(keyFilter);
  if (storage === null) return;

  const storageParsed = JSON.parse(storage);
  const filterStorage = storageParsed.filter((itemId) => itemId !== id);
  localStorage.setItem(keyFilter, JSON.stringify(filterStorage));
};
