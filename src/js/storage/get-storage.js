import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function getStorage(e, key) {
  e.preventDefault();

  const KEY_STORAGE = key;
  const fetchStorage = localStorage.getItem(KEY_STORAGE);
  const parsData = fetchStorage === null ? undefined : JSON.parse(fetchStorage);

   return parsData ??
      Notify.info(`Your ${KEY_STORAGE} is empty, add something first.`, {
        width: '320px',
        showOnlyTheLastOne: true,
        clickToClose: true,
      });
  
  }

// Перевірка довжини строки

// const string = document.querySelector('.string');
// const lengthString = string.textContent;

// function maxLengthString(string) {
//   return string.length > 25
//     ? console.log(string.slice(0, 25).padEnd(29, '.'))
//     : console.log(string);
// }
// maxLengthString(lengthString);
