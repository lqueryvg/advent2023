import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

const isDigit = (character: string) => {
  if (character.length === 1) {
    const code = character.codePointAt(0)
    return 47 < code! && code! < 58
  }
  return false
}

const getDigitValue = (character: string) => {
  const code = character.codePointAt(0)
  return code! - 48
}

const main = () => {
  const data = getInput('input.txt')
  let total = 0
  for (const line of data) {
    let lineResult = 0
    let lastDigit = 0
    for (const c of line) {
      if (isDigit(c)) {
        const thisDigitValue = getDigitValue(c)
        if (lineResult === 0) lineResult = thisDigitValue * 10
        lastDigit = thisDigitValue
      }
    }
    lineResult += lastDigit
    total += lineResult
  }

  return total
}

export { main }
