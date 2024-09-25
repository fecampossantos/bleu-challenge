import { KEY } from "./constants";

export const addToRecentSearches = (value: string) => {
  const previousSearches = localStorage.getItem(KEY);
  if (previousSearches) {
    const newSearches = [value, ...previousSearches.split(",")].filter(
      function (item, pos, self) {
        return self.indexOf(item) == pos;
      }
    );
    localStorage.setItem(KEY, newSearches.splice(0, 5).join(","));
  } else {
    localStorage.setItem(KEY, value);
  }
};
