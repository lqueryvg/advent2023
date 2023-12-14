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

type Direction = 'north' | 'south' | 'east' | 'west'
let width: number
let height: number

const moveRock = (
  lines: string[],
  row: number,
  x: number,
  direction: Direction
): boolean => {
  const thisChar = lines[row][x]
  let targetChar: string
  switch (direction) {
    case 'north':
      if (row < 1) return false
      targetChar = lines[row - 1][x]
      if (thisChar === 'O' && targetChar === '.') {
        lines[row - 1] = setCharAt(lines[row - 1], x, 'O')
        lines[row] = setCharAt(lines[row], x, '.')
        return true
      }
      break
    case 'south':
      if (row >= height - 1) return false
      targetChar = lines[row + 1][x]
      if (thisChar === 'O' && targetChar === '.') {
        lines[row + 1] = setCharAt(lines[row + 1], x, 'O')
        lines[row] = setCharAt(lines[row], x, '.')
        return true
      }
      break
    case 'east':
      if (x >= width - 1) return false
      targetChar = lines[row][x + 1]
      if (thisChar === 'O' && targetChar === '.') {
        lines[row] = setCharAt(lines[row], x + 1, 'O')
        lines[row] = setCharAt(lines[row], x, '.')
        return true
      }
      break
    case 'west':
      if (x < 1) return false
      targetChar = lines[row][x - 1]
      if (thisChar === 'O' && targetChar === '.') {
        lines[row] = setCharAt(lines[row], x - 1, 'O')
        lines[row] = setCharAt(lines[row], x, '.')
        return true
      }
      break
  }

  return false
}

const patterns: Record<string, number> = {}

const main = () => {
  const lines = getInput('input.txt')

  height = lines.length
  width = lines[0].length

  let cycle = 0

  while (true) {
    if (cycle === 1000000000) break
    for (const direction of ['north', 'west', 'south', 'east']) {
      let rocksMoved = true
      while (rocksMoved) {
        rocksMoved = false
        for (let row = 0; row < height; row++) {
          for (let x = 0; x < width; x++) {
            if (moveRock(lines, row, x, direction as Direction)) {
              rocksMoved = true
            }
          }
        }
      }
    }
    cycle += 1
    const pattern = lines.join(',')
    if (pattern in patterns) {
      const cycleDelta = cycle - patterns[pattern]
      // console.log('repeat of', { cycle: patterns[pattern], cycleDelta })
      const numCycles = Math.floor((1000000000 - cycle) / cycleDelta)
      cycle += numCycles * cycleDelta
    }
    patterns[pattern] = cycle
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
