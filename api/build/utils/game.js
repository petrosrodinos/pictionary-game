"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeGreekAccents = exports.Points = void 0;
exports.Points = {
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
const removeGreekAccents = (word) => {
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
exports.removeGreekAccents = removeGreekAccents;
