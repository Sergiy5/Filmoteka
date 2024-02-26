import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function getStorage(key) {
  // const key = key;
  const fetchStorage = localStorage.getItem(key);
  const parsData = fetchStorage === null ? undefined : JSON.parse(fetchStorage);
  
  if (!parsData) {
   Notify.info(`Your ${key} is empty, add something first.`, {
      width: '320px',
      showOnlyTheLastOne: true,
      clickToClose: true,
   })
    
    return parsData ?? [];
}
    return parsData 
}

