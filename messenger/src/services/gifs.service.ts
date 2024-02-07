import { API_KEY, API_URL, LIMIT_25, RATING_G } from "../config/giphyConfig";


export const loadTrending = () => {
    const trending =
      fetch(`${API_URL}/trending?${API_KEY}&${LIMIT_25}&offset=0&${RATING_G}&bundle=messaging_non_clips`)
        .then(res => res.json())
        .catch(err => console.error(err));
  
    return trending;
};


export const loadSearchGifs = (searchTerm = '') => {
    const wordsOfSearchTerm = searchTerm.split(' ');
    let wordsOfSearchTermToString = wordsOfSearchTerm.reduce((acc, el) => {
        if (el.startsWith('@')) {
        acc = acc + ('+%40' + el);
        } else {
        acc = acc + ('+' + el);
        }
        return acc;
    }, '');
    wordsOfSearchTermToString = wordsOfSearchTermToString.slice(1);

    const foundGifs = fetch(`${API_URL}/search?${API_KEY}&q=${wordsOfSearchTermToString}&${LIMIT_25}&offset=0&${RATING_G}&lang=en&bundle=messaging_non_clips`)
        .then(res => res.json())
        .catch(err => console.error(err));

    return foundGifs;
};