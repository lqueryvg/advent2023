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

const printGrid = (lines: string[]) => {
  for (const line of lines) {
    console.log(line)
  }
}
const transpose = (lines: string[]): string[] => {
  let newLines: string[] = []
  for (let x = 0; x < lines[0].length; x++) {
    let line = ''
    for (let y = 0; y < lines.length; y++) {
      line += lines[y][x]
    }
    newLines.push(line)
  }
  return newLines
}

const getReflectionNumber = (lines: string[]) => {
  checking: for (let row = 0; row < lines.length - 1; row++) {
    // console.log({ line: lines[row] })
    if (lines[row] === lines[row + 1]) {
      // console.log({ row, line: lines[row] })
      const rowsBelow = lines.length - row - 2
      const rowsAbove = row
      // console.log({ rowsBelow })
      for (let i = 1; i <= Math.min(rowsAbove, rowsBelow); i++) {
        // console.log({ i, row: lines[row + i + 1] })
        if (lines[row + i + 1] !== lines[row - i]) {
          // console.log('nope')
          continue checking
        }
      }
      // console.log('horizontal reflection found at row', row + 1)
      return row + 1
    }
  }
  return -1
}

const doGrid = (lines: string[]): number => {
  // horizontal
  let result = getReflectionNumber(lines)
  if (result >= 0) return 100 * result

  const transposed = transpose(lines)

  // vertical
  result = getReflectionNumber(transposed)
  if (result >= 0) return result

  console.log('before transpose')
  printGrid(lines)
  console.log('after transpose')
  printGrid(transposed)

  throw new Error('no reflection found')
}

const main = () => {
  const lines = getInput('input.txt')

  let total = 0
  let grid: string[] = []
  for (const line of lines) {
    // console.log({ line })
    if (line === '') {
      total += doGrid(grid)
      grid = []
      continue
    }
    grid.push(line)
  }
  total += doGrid(grid)
  return total
}

export { main }
