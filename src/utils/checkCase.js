export const checkUpperCase = (word) => {
    return /[A-Z]/.test(word);
};
export const checkLowerCase = (word) => {
    return /[a-z]/.test(word);
};
export const checkArrUpperCase = (word) => {
    return word.some((txt) => /[A-Z]/.test(txt));
};
export const checkArrLowerCase = (word) => {
    return word.some((txt) => /[a-z]/.test(txt));
};
export const wordCount = (word) => {
    return word.length >= 8;
};
export const checkNumber = (word) => {
    return /[0-9]/.test(word);
};
export const specialCharacter = (word) => {
    return /[^a-zA-Z0-9]/.test(word);
};
