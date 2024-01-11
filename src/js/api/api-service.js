import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { API_KEY, TREND_URL, SEARCH_URL, ID_URL } from './apiUrl';

//*Get trending moies=================================================
export async function getTrending(page) {
  try {
    const response = await axios.get(`${TREND_URL}${page}`);
    return response.data;
  } catch (error) {
    Notify.info('Sorry, but we can`t download this', {
      width: '320px',
      showOnlyTheLastOne: true,
      clickToClose: true,
    });
  }
}

//* Get movie by ID====================================================
export async function getMovieById(id) {
  try {
    const response = await axios.get(
      `${ID_URL}/${id}?api_key=${API_KEY}&language=en-US`
    );
    return response.data;
  } catch (error) {
    Notify.info('Sorry, but we can`t find this movie', {
      width: '320px',
      showOnlyTheLastOne: true,
      clickToClose: true,
    });
  }
}

//* Get search movie=================================================================
export async function movieOnSearch(text, page = 1) {
  try {
    const { data } = await axios.get(
      `${SEARCH_URL}?api_key=${API_KEY}&language=en-US&query=${text}&page=${page}`
    );
    return data;
  } catch (error) {
       Notify.info(error.message);
  }
}
//* URL for movie by ID from another API =====================================
 
// const URL_IMDB = `https://api.themoviedb.org/3/find/tt15789038?external_source=imdb_id&api_key=${API_KEY}`;
