import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  // or other processing...
  // for (const line of lines) {
  //   if (line === '') continue // skip blank lines
  // }
  return lines
}

const isDigit = (character: string) => {
  // if (!character) return false
  // console.log({ character })
  const code = character.codePointAt(0)
  return 47 < code! && code! < 58
}

const isSymbol = (character: string) => {
  return character !== '.' && !isDigit(character)
}

const getDigitValue = (character: string) => {
  const code = character.codePointAt(0)
  return code! - 48
}

const main = () => {
  const lines = getInput('input.txt')

  // console.log({ h: lines.length, w: lines[0].length })

  const getCharAt = (x: number, y: number) => {
    if (y < 0 || y + 1 >= lines.length || x < 0 || x + 1 >= lines[0].length)
      return '.'
    return lines[y][x]
  }

  const hasSymbolNeighbor = (x: number, y: number) => {
    return (
      isSymbol(getCharAt(x - 1, y - 1)) ||
      isSymbol(getCharAt(x - 1, y)) ||
      isSymbol(getCharAt(x - 1, y + 1)) ||
      isSymbol(getCharAt(x + 1, y - 1)) ||
      isSymbol(getCharAt(x + 1, y)) ||
      isSymbol(getCharAt(x + 1, y + 1)) ||
      isSymbol(getCharAt(x, y - 1)) ||
      isSymbol(getCharAt(x, y + 1))
    )
  }

  let total = 0
  let y = 0
  for (const line of lines) {
    let x = 0
    let number: number = 0
    let symbolNeighborFound = false
    for (const character of line) {
      // console.log({ y, x, character })
      if (isDigit(character)) {
        number = number * 10 + getDigitValue(character)
        if (!symbolNeighborFound) {
          symbolNeighborFound = hasSymbolNeighbor(x, y)
        }
      } else {
        if (symbolNeighborFound && number > 0) {
          // console.log({ number, y, x })
          total += number
        } else {
          // if (number > 0) console.log({ x, y, number })
        }
        number = 0
        symbolNeighborFound = false
      }
      // console.log({ symbolNeighborFound })
      x++
    }
    if (symbolNeighborFound && number > 0) {
      // console.log({ number, y, x })
      total += number
    }
    y++
  }

  return total
}

export { main }
