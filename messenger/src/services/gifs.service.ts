import { API_KEY, API_URL, LIMIT_25, RATING_G } from "../common/constants";

export const loadTrending = () => {
    const trending =
      fetch(`${API_URL}/trending?${API_KEY}&${LIMIT_25}&offset=0&${RATING_G}&bundle=messaging_non_clips`)
        .then(res => res.json())
        .catch(err => console.error(err));
  
    return trending;
  };