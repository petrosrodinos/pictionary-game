export const Points: { [key: number]: number } = {
  1: 20,
  2: 15,
  3: 10,
  4: 5,
  5: 3,
  6: 2,
  7: 1,
  8: 1,
  9: 1,
  10: 1,
};

export const removeGreekAccents = (word: string) => {
  return word
    .replace(/ά/g, "α")
    .replace(/έ/g, "ε")
    .replace(/ή/g, "η")
    .replace(/ί/g, "ι")
    .replace(/ό/g, "ο")
    .replace(/ύ/g, "υ")
    .replace(/ώ/g, "ω")
    .replace(/ϊ/g, "ι")
    .replace(/ΐ/g, "ι")
    .replace(/ϋ/g, "υ")
    .replace(/ΰ/g, "υ");
};
