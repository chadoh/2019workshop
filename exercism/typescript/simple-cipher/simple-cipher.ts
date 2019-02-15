const letters = "abcdefghijklmnopqrstuvwxyz"

function getRandomString(len = 100) {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(letters.charAt(Math.floor(Math.random() * letters.length)))
  }
  return arr.join("")
}

function positionInAlphabet(letter: string) {
  return letter.charCodeAt(0) - 97
}

class SimpleCipher {
  public key: string

  constructor(key = getRandomString()) {
    if (!key || key.match(/([A-Z]|[0-9])/)) {
      throw new Error("Bad key")
    }
    this.key = key
  }

  encode(input: string) {
    return input.split("").map((letter, index) => {
      const inputLetterPosition = positionInAlphabet(letter)
      const keyLetterPosition = positionInAlphabet(this.key[index % this.key.length])
      const newLetterPositionRaw = inputLetterPosition + keyLetterPosition
      const newLetterPosition = newLetterPositionRaw > 25
        ? newLetterPositionRaw - letters.length
        : newLetterPositionRaw
      return letters[newLetterPosition]
    }).join("")
  }

  decode(input: string) {
    return input.split("").map((letter, index) => {
      const inputLetterPosition = positionInAlphabet(letter)
      const keyLetterPosition = positionInAlphabet(this.key[index % this.key.length])
      const newLetterPositionRaw = inputLetterPosition - keyLetterPosition
      const newLetterPosition = newLetterPositionRaw < 0
        ? letters.length + newLetterPositionRaw
        : newLetterPositionRaw
      return letters[newLetterPosition]
    }).join("")
  }
}

export default SimpleCipher
