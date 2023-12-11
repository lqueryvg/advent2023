import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

type Point = { x: number; y: number }
type Direction = 'U' | 'D' | 'L' | 'R'

let width: number
let height: number
let grid: string[]

const getNext = (p: Point, direction: Direction): Point => {
  switch (direction) {
    case 'U':
      return { x: p.x, y: p.y - 1 }
    case 'D':
      return { x: p.x, y: p.y + 1 }
    case 'L':
      return { x: p.x - 1, y: p.y }
    case 'R':
      return { x: p.x + 1, y: p.y }
  }
}

const nextDirections: any = {
  U: {
    F: 'R',
    7: 'L',
    '|': 'U',
  },
  D: {
    L: 'R',
    J: 'L',
    '|': 'D',
  },
  L: {
    L: 'U',
    F: 'D',
    '-': 'L',
  },
  R: {
    J: 'U',
    7: 'D',
    '-': 'R',
  },
}

const getDistance = (p: Point, direction: Direction): number => {
  let distance = 1

  while (true) {
    // out of bounds ?
    if (p.x < 0 || p.x >= width || p.y < 0 || p.y >= width) {
      console.log('out of bounds')
      return 0
    }
    const pipe = grid[p.y][p.x]

    // found the start ?
    if (pipe === 'S') break
    if (pipe === '.') return 0

    // connected ?
    if (!(pipe in nextDirections[direction])) {
      console.log('invalid pipe')
      return 0
    }

    distance++

    const newDirection = nextDirections[direction][pipe]
    p = getNext(p, newDirection)
    direction = newDirection
  }

  return distance
}

const findStart = (): Point => {
  let y = 0
  for (const line of grid) {
    if (!line.match(/S/)) {
      y++
      continue
    }
    return { x: line.indexOf('S'), y }
  }
  throw Error('start not found')
}

const main = () => {
  grid = getInput('input.txt')
  height = grid.length
  width = grid[0].length

  const start = findStart()

  const answer = Math.floor(
    (getDistance(getNext(start, 'U'), 'U') ||
      getDistance(getNext(start, 'R'), 'R') ||
      getDistance(getNext(start, 'D'), 'D') ||
      getDistance(getNext(start, 'L'), 'L')) / 2
  )
  return answer
}

export { main }
