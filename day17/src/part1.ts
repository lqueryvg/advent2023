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
type Heuristic = (p: PointInt) => number
type CameFromMap = Record<PointInt, PointInt>
// For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
// to n currently known.
const cameFrom: CameFromMap = {}

const getNeighbors = (point: PointInt) => {
  const p = intToPoint(point)
  const prev = cameFrom[point]
  const prevP = intToPoint(prev)
  const prevPrev = cameFrom[prev]
  const prevPrevP = intToPoint(prevPrev)
  const res = []
  if (!(p.x === prevP.x && p.x === prevPrevP.x)) {
    if (p.y + 1 < height) {
      // Down
      res.push(pointToInt(p.x, p.y + 1))
    }
    if (p.y - 1 >= 0) {
      // Up
      res.push(pointToInt(p.x, p.y - 1))
    }
  }
  if (!(p.y === prevP.y && p.y === prevPrevP.y)) {
    if (p.x + 1 < width) {
      // Right
      res.push(pointToInt(p.x + 1, p.y))
    }
    if (p.x - 1 >= 0) {
      // Left
      res.push(pointToInt(p.x - 1, p.y))
    }
  }
  return res
}

function reconstructPath(cameFrom: CameFromMap, current: PointInt) {
  const totalPath: PointInt[] = [current]
  while (current in cameFrom) {
    current = cameFrom[current]
    totalPath.unshift(current)
  }
  return totalPath
}

const astar = (params: {
  grid: string[]
  start: PointInt
  goal: PointInt
  h: Heuristic
}) => {
  const goalPoint = intToPoint(params.goal)
  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  // This is usually implemented as a min-heap or priority queue rather than a hash-set.
  const openSet: PointInt[] = [params.start]

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
  const gScore: Record<PointInt, number> = {}
  gScore[params.start] = 0

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how cheap a path could be from start to finish if it goes through n.
  const fScore: Record<PointInt, number> = {}
  fScore[params.start] = params.h(params.start)
  console.log({ fScore })

  let numSteps = 0
  const maxSteps = 1000
  while (true) {
    if (openSet.length === 0) break
    numSteps++
    console.log({ numSteps })
    if (numSteps >= maxSteps) {
      console.log(`giving up after ${numSteps} steps`)
      break
    }

    // current = the node in openSet having the lowest fScore[] value
    // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
    let lowestFScoreNodeIndex = 0
    for (let i = 0; i < openSet.length; i++) {
      if (fScore[openSet[i]] < fScore[openSet[lowestFScoreNodeIndex]]) {
        lowestFScoreNodeIndex = i
      }
    }
    console.log({ lowestFScoreNodeIndex })
    const current = openSet[lowestFScoreNodeIndex]
    openSet.splice(lowestFScoreNodeIndex, 1)

    if (current === params.goal) {
      return reconstructPath(cameFrom, current)
    }

    const d = (_current: Point, neighbor: Point) => {
      // return Math.abs(current.x - neighbor.x) + Math.abs(current.y - neighbor.y)
      return parseInt(params.grid[neighbor.y][neighbor.x])
    }

    for (const neighbor of getNeighbors(current)) {
      // d(current,neighbor) is the weight of the edge from current to neighbor
      // tentative_gScore is the distance from start to the neighbor through current
      const tentativeGScore =
        gScore[current] + d(intToPoint(current), intToPoint(neighbor))
      console.log({ current, neighbor, tentativeGScore })
      if (!(neighbor in gScore)) {
        gScore[neighbor] = Number.POSITIVE_INFINITY
      }
      // console.log({ gScore })
      if (tentativeGScore < gScore[neighbor]) {
        // This path to neighbor is better than any previous one. Record it!
        cameFrom[neighbor] = current
        gScore[neighbor] = tentativeGScore
        fScore[neighbor] = tentativeGScore + params.h(neighbor)
        if (!openSet.includes(neighbor)) {
          console.log('push', { neighbor })
          openSet.push(neighbor)
        }
      }
    }
  }
  throw new Error('no path found')
}

function setStringChar(str: string, index: number, chr: string) {
  if (index > str.length - 1) return str
  return str.substring(0, index) + chr + str.substring(index + 1)
}

function setChar(grid: string[], x: number, y: number, c: string) {
  const height = grid.length
  const width = grid[0].length
  grid[y] = setStringChar(grid[y], x, c)
}

const main = () => {
  const grid = getInput('input.txt')
  height = grid.length
  width = grid[0].length

  const path = astar({
    grid,
    start: pointToInt(0, 0),
    goal: pointToInt(width - 1, height - 1),
    h: (p: PointInt) => 1,
  })

  const pathGrid = Array(height).fill(''.padStart(width, '.'))

  let heatLoss = 0
  for (const p of path) {
    const point = intToPoint(p)
    const energyChar = grid[point.y][point.x]
    setChar(pathGrid, point.x, point.y, energyChar)
    heatLoss += parseInt(energyChar)
    console.log({ point })
  }
  // console.log({ path })

  const printGrid = (lines: string[]) => {
    for (const line of lines) {
      console.log(line)
    }
  }

  printGrid(pathGrid)

  // console.log(grid)
  return heatLoss
}

export { main }
