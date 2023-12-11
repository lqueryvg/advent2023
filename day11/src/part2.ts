import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

const main = () => {
  const grid = getInput('input.txt')

  const inputWidth = grid[0].length
  const inputHeight = grid.length

  // find blank columns
  const blankColumns: number[] = []
  nextColumn: for (let x = 0; x < inputWidth; x++) {
    for (let y = 0; y < inputHeight; y++) {
      if (grid[y][x] === '#') {
        continue nextColumn
      }
    }
    blankColumns.push(x)
  }

  // find blank rows
  const blankRows: number[] = []
  for (let y = 0; y < inputHeight; y++) {
    if (grid[y].indexOf('#') === -1) {
      blankRows.push(y)
    }
  }

  type Point = { x: number; y: number }
  const stars: Point[] = []

  const expansionFactor = 1000000

  // find coords of all stars
  let yy: number = 0 // expanded rows
  for (let y = 0; y < inputHeight; y++) {
    if (blankRows.includes(y)) yy++
    let xx: number = 0 // expanded columns
    for (let x = 0; x < inputWidth; x++) {
      if (blankColumns.includes(x)) xx++
      if (grid[y][x] === '#') {
        stars.push({
          x: x + xx * (expansionFactor - 1),
          y: y + yy * (expansionFactor - 1),
        })
      }
    }
  }

  let total = 0

  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const star1 = stars[i]
      const star2 = stars[j]
      const distance = Math.abs(star1.x - star2.x) + Math.abs(star1.y - star2.y)
      total += distance
    }
  }

  return total
}

export { main }
