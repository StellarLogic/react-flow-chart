export const checkForEndId = (arr) => {
  if (arr.length > 0) {
    const selectedLine = arr.map((item) => item.endId == null);
    const nullEndObject = arr.find((item) => item.endId == null);
    const index = selectedLine.indexOf(true);
    const isTrue = selectedLine.includes(true) ? true : false;
    return { isTrue: true, nullEndObject, index };
  }

  return { isTrue: false, nullEndObject: {}, index: null };
};
