import axios from 'axios';
import { API_KEY, BASE_URL, TREND_URL, SEARCH_URL, ID_URL } from './api';

export async function getTrending(page) {
    const url = `${BASE_URL}/trending/all/day?api_key=${API_KEY}&language=en-US&page=${page}`;
    return await axios
    .get(url)
      .then(response => {
      return response.data;
    })
};


export async function movieOnSearch(text, page = 1) {
  try {
    const { data } = await axios.get(
      `${SEARCH_URL}?api_key=${API_KEY}&language=en-US&query=${text}&page=${page}`
    );
    return data;
  } catch (error) {
    console.error('Smth wrong with api search fetch' + error);
  }
}

export async function getMovieById(id) {
  try {
    const { data } = await axios.get(
      `${ID_URL}/${id}?api_key=${API_KEY}&language=en-US`
    );

    return data;
  } catch (error) {
    console.error('Smth wrong with api ID fetch' + error.status);
  }
}

export async function getArrayofFilms(array) {
  const arrayOfFilms = array.map(async id => {
    return await axios
      .get(`${ID_URL}/${id}?api_key=${API_KEY}&language=en-US`)
      .then(response => {
        return response.data;
      })
      .catch(error => console.log(error));
  });

  const resultData = await Promise.all(arrayOfFilms);
  return resultData;
}
