export const checkUpperCase = (word: string) => {
    return /[A-Z]/.test(word)
}
export const checkLowerCase = (word: string) => {
    return /[a-z]/.test(word)
}

export const checkArrUpperCase = (word: string[]) => {
    return word.some((txt) => /[A-Z]/.test(txt))
}

export const checkArrLowerCase = (word: string[]) => {
    return word.some((txt) => /[a-z]/.test(txt))
}

export const wordCount = (word: string) => {
    return word.length >= 8
}

export const checkNumber = (word: string) => {
    return /[0-9]/.test(word)
}

export const specialCharacter = (word: string) => {
    return /[^a-zA-Z0-9]/.test(word)
}
