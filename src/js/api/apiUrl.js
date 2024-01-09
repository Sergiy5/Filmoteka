import axios from 'axios';

axios.defaults.baseURL = 'https://api.themoviedb.org/3';

const API_KEY = '900c3c2e823d6abe3929dac959f94e63';
const TREND_URL = `/trending/all/day?api_key=${API_KEY}&language=en-US&page=`;
const SEARCH_URL = `/search/movie`;
const ID_URL = `/movie`;

export { API_KEY, TREND_URL, SEARCH_URL, ID_URL };

