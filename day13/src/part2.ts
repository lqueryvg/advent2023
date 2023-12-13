import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
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

const getReflectionNumber = (lines: string[], previousResult = -1): number => {
  checking: for (let row = 0; row < lines.length - 1; row++) {
    if (lines[row] === lines[row + 1]) {
      const rowsBelow = lines.length - row - 2
      const rowsAbove = row
      for (let i = 1; i <= Math.min(rowsAbove, rowsBelow); i++) {
        if (lines[row + i + 1] !== lines[row - i]) {
          continue checking
        }
      }
      const result = row + 1
      if (result !== previousResult) return result
    }
  }
  return -1
}

function toggle(c: string): string {
  if (c === '.') return '#'
  return '.'
}

const getReflectionNumberWithSmudge = (
  lines: string[],
  unsmudgedResult: number
): number => {
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      const oldValue = lines[y][x]
      lines[y] = setCharAt(lines[y], x, toggle(oldValue))
      const result = getReflectionNumber(lines, unsmudgedResult)
      lines[y] = setCharAt(lines[y], x, oldValue)
      if (result >= 0 && result !== unsmudgedResult) {
        return result
      }
    }
  }
  return -1
}

const doGrid = (lines: string[]): number => {
  let unsmudgedResult = getReflectionNumber(lines)
  let result = getReflectionNumberWithSmudge(lines, unsmudgedResult)
  if (result >= 0) return 100 * result

  const transposed = transpose(lines)

  unsmudgedResult = getReflectionNumber(transposed)
  result = getReflectionNumberWithSmudge(transposed, unsmudgedResult)
  if (result >= 0) return result

  printGrid(lines)
  printGrid(transposed)

  throw new Error('no reflection found')
}

const main = () => {
  const lines = getInput('input.txt')

  let total = 0
  let grid: string[] = []
  for (const line of lines) {
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
