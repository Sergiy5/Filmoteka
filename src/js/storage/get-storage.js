import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function getStorage(e, key) {
  e.preventDefault();
  const KEY_STORAGE = key;
  const fetchStorage = localStorage.getItem(KEY_STORAGE);
  const parsData = fetchStorage === null ? undefined : JSON.parse(fetchStorage);
  const dataValueBtn = e.target.attributes?.data?.value;
  
  if (dataValueBtn === 'current') {
    return parsData ?? [];
  }

  if (!parsData) {
   Notify.info(`Your ${KEY_STORAGE} is empty, add something first.`, {
      width: '320px',
      showOnlyTheLastOne: true,
      clickToClose: true,
    })
  return []
}
    return parsData 
}

