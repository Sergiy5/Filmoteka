import refs from "../refs";
const { watchedBtn, queueBtn } = refs;
import { showMovieInQeue, showMovieInWatched } from "../utils";


// Switch class 'current' on watched or queue =========================

export const toggleClassCurrent = (e) => {
  const key = e.target.getAttribute("data-current");
    const page = 1;
    
  switch (key) {
    case "watched":
      queueBtn.classList.remove("current__library");
      watchedBtn.classList.add("current__library");
      
      showMovieInWatched(page);
      
      break;
      
      case "queue":
      watchedBtn.classList.remove("current__library");
      queueBtn.classList.add("current__library");
      
      showMovieInQeue(page);

      break;

    default:
      console.log(e);
      break;
  }
};