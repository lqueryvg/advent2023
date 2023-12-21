import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

let height: number
let width: number

const pointToInt = (x: number, y: number) => {
  return x * 1e3 + y
}
const intToPoint = (int: number) => {
  return {
    x: Math.floor(int / 1e3),
    y: int % 1e3,
  }
}

type Point = { x: number; y: number }
type PointInt = number

const getNeighbors = (point: PointInt) => {
  const p = intToPoint(point)
  const res: number[] = []

  if (p.y + 1 < height) res.push(pointToInt(p.x, p.y + 1)) // Down
  if (p.y - 1 >= 0) res.push(pointToInt(p.x, p.y - 1)) // Up
  if (p.x + 1 < width) res.push(pointToInt(p.x + 1, p.y)) // Right
  if (p.x - 1 >= 0) res.push(pointToInt(p.x - 1, p.y)) // Left
  return res
}

const main = () => {
  const grid = getInput('input.txt')
  height = grid.length
  width = grid[0].length

  // find start
  let start: Point | undefined
  for (let y = 0; y < width; y++) {
    const x = grid[y].indexOf('S')
    if (x >= 0) {
      start = { x, y }
    }
  }
  if (start === undefined) throw new Error('start not found')

  let frontier: Set<number> = new Set()

  frontier.add(pointToInt(start.x, start.y))
  let steps = 0
  const maxSteps = 64

  while (true) {
    steps++
    if (steps > maxSteps) {
      break
    }
    const newFrontier: Set<number> = new Set()

    for (const node of frontier) {
      const neighbors = getNeighbors(node)
      for (const neighbor of neighbors) {
        const neighborPoint = intToPoint(neighbor)
        if (grid[neighborPoint.y][neighborPoint.x] === '#') {
          continue
        }
        if (!frontier.has(neighbor)) {
          newFrontier.add(neighbor)
        }
      }
    }
    frontier = newFrontier
  }

  const printGrid = (lines: string[]) => {
    for (const line of lines) {
      console.log(line)
    }
  }

  // printGrid(grid)

  return frontier.size
}

export { main }
