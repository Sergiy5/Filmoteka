import { Loading } from "notiflix";

export function onLoadSpiner() {
  Loading.pulse({ clickToClose: true, svgSize: "100px" });
}
export function loaderRemove() {
  Loading.remove();
}
