import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  return file.split(/\r\n|\n/)
}

function setStringChar(str: string, index: number, chr: string) {
  if (index > str.length - 1) return str
  return str.substring(0, index) + chr + str.substring(index + 1)
}

function setChar(grid: string[], x: number, y: number, c: string) {
  grid[y] = setStringChar(grid[y], x, c)
}

function drawHorizontal(
  grid: string[],
  x: number,
  y: number,
  length: number,
  c: string
) {
  for (let xi = 1; xi < length; xi++) {
    setChar(grid, x + xi, y, '-')
  }
}

function drawVertical(
  grid: string[],
  x: number,
  y: number,
  length: number,
  c: string
) {
  for (let yi = 1; yi < length; yi++) {
    setChar(grid, x, y + yi, '|')
  }
}

const printGrid = (lines: string[]) => {
  for (const line of lines) {
    console.log(line)
  }
}

type Direction = 'D' | 'U' | 'L' | 'R'

const main = () => {
  const lines = getInput('input.txt')
  let [x, y] = [0, 0]

  let minX = Number.MAX_SAFE_INTEGER
  let maxX = Number.MIN_SAFE_INTEGER
  let minY = Number.MAX_SAFE_INTEGER
  let maxY = Number.MIN_SAFE_INTEGER

  let drawLength = 0
  // get width, height & start position
  for (const line of lines) {
    const [directionText, lengthText, _] = line.split(' ')
    const direction = directionText as Direction
    const length = parseInt(lengthText)
    drawLength += length
    switch (direction) {
      case 'L':
        x -= length
        break
      case 'R':
        x += length
        break
      case 'U':
        y -= length
        break
      case 'D':
        y += length
        break
    }

    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }

  const [startX, startY] = [Math.abs(minX), Math.abs(minY)]

  const width = maxX - minX + 1
  const height = maxY - minY + 1
  const grid = Array(height).fill(''.padStart(width, '.'))

  x = startX
  y = startY

  const corners: Record<string, string> = {
    LU: 'L',
    LD: 'F',
    RU: 'J',
    RD: '7',
    UR: 'F',
    UL: '7',
    DR: 'L',
    DL: 'J',
    L: '.',
    D: '.',
    U: '.',
    R: '.',
  }

  // draw
  let prevDirection = ''
  let firstDirection = ''
  for (const line of lines) {
    const [directionText, lengthText, _] = line.split(' ')
    const direction = directionText as Direction
    if (firstDirection === '') firstDirection = direction
    const length = parseInt(lengthText)
    const directionPair = `${prevDirection}${direction}`
    const cornerChar = corners[directionPair]
    setChar(grid, x, y, cornerChar)
    switch (direction) {
      case 'L':
        x -= length
        drawHorizontal(grid, x, y, length, '#')
        break
      case 'R':
        drawHorizontal(grid, x, y, length, '#')
        x += length
        break
      case 'U':
        y -= length
        drawVertical(grid, x, y, length, '#')
        break
      case 'D':
        drawVertical(grid, x, y, length, '#')
        y += length
        break
    }

    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) minY = y
    prevDirection = direction
  }
  setChar(grid, startX, startY, corners[`${prevDirection}${firstDirection}`])

  const fill = (grid: string[]): number => {
    let count = 0
    for (const line of grid) {
      let isIn = false
      for (let x = 0; x < width; x++) {
        const c = line.charAt(x)
        if (c === '.' && isIn) {
          count++
        }
        if ('7|F'.includes(c)) {
          isIn = !isIn
        }
      }
    }

    return count
  }

  let count = 0
  count += fill(grid)

  return count + drawLength
}

export { main }
