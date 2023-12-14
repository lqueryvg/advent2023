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

function setCharAt(str: string, index: number, chr: string) {
  if (index > str.length - 1) return str
  return str.substring(0, index) + chr + str.substring(index + 1)
}

const printGrid = (lines: string[]) => {
  for (const line of lines) {
    console.log(line)
  }
}

const main = () => {
  const lines = getInput('input.txt')

  const height = lines.length
  const width = lines[0].length

  let rocksMoved = true
  while (rocksMoved) {
    rocksMoved = false
    for (let row = 1; row < height; row++) {
      for (let x = 0; x < width; x++) {
        const thisChar = lines[row][x]
        const charAbove = lines[row - 1][x]
        if (thisChar === 'O' && charAbove === '.') {
          lines[row - 1] = setCharAt(lines[row - 1], x, 'O')
          lines[row] = setCharAt(lines[row], x, '.')
          rocksMoved = true
        }
      }
    }
  }

  let total = 0
  for (let row = height - 1; row >= 0; row--) {
    for (let x = 0; x < width; x++) {
      const thisChar = lines[row][x]
      if (thisChar === 'O') total += height - row
    }
  }

  return total
}

export { main }
