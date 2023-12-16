import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
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

const printGrid = (lines: string[]) => {
  for (const line of lines) {
    console.log(line)
  }
}

const reflectionMap: Record<string, Direction> = {
  '>/': '^',
  '>\\': 'v',
  '^/': '>',
  '^\\': '<',
  '</': 'v',
  '<\\': '^',
  'v/': '<',
  'v\\': '>',
  'v.': 'v',
  '>.': '>',
  '^.': '^',
  '<.': '<',
}

// type Point = { x: number; y: number }
type Direction = '^' | 'v' | '<' | '>'
type Beam = { x: number; y: number; direction: Direction }
let width = 0
let height = 0

let maxCount = Number.MIN_SAFE_INTEGER

function count(lines: string[], start: Beam) {
  const energyGrid = Array(height).fill(''.padStart(width, '.'))
  const beams: Beam[] = [start]
  const visitedMap: Record<string, boolean> = {}

  setChar(energyGrid, start.x, start.y, '#')
  visitedMap['0,0,>'] = true
  visitedMap[`${start.x},${start.y},${start.direction}`] = true

  // while there are beams
  while (beams.length > 0) {
    // for each beam
    let beamIndex = beams.length
    nextBeam: while (beamIndex--) {
      // move the beam
      let beam = beams[beamIndex]
      switch (beam.direction) {
        case '<':
          if (beam.x === 0) {
            beams.splice(beamIndex, 1)
            continue nextBeam
          }
          beam = { ...beam, x: beam.x - 1 }
          break
        case '>':
          if (beam.x === width - 1) {
            beams.splice(beamIndex, 1)
            continue nextBeam
          }
          beam = { ...beam, x: beam.x + 1 }
          break
        case '^':
          if (beam.y === 0) {
            beams.splice(beamIndex, 1)
            continue nextBeam
          }
          beam = { ...beam, y: beam.y - 1 }
          break
        case 'v':
          if (beam.y === height - 1) {
            beams.splice(beamIndex, 1)
            continue nextBeam
          }
          beam = { ...beam, y: beam.y + 1 }
          break
      }
      beams[beamIndex] = beam

      // set energy grid cell
      setChar(energyGrid, beam.x, beam.y, '#')

      // if cell has already been visited by another beam in this direction
      if (visitedMap[`${beam.x},${beam.y},${beam.direction}`]) {
        // stop the beam
        beams.splice(beamIndex, 1)
        continue
      }
      visitedMap[`${beam.x},${beam.y},${beam.direction}`] = true

      const currentChar = lines[beam.y][beam.x]
      if ('/\\'.includes(currentChar)) {
        // mirror: set new direction
        beam.direction = reflectionMap[`${beam.direction}${currentChar}`]
      } else if ('|-'.includes(currentChar)) {
        // splitter: create another beam in opposite direction
        if ('<>'.includes(beam.direction) && currentChar === '|') {
          if (beam.y === 0) {
            beams.splice(beamIndex, 1)
          }
          beam.direction = '^'
          if (beam.y < height - 1) {
            const newBeam: Beam = { ...beam, direction: 'v' }
            beams.push(newBeam)
          }
        } else if ('^v'.includes(beam.direction) && currentChar === '-') {
          if (beam.x === 0) {
            beams.splice(beamIndex, 1)
          }
          beam.direction = '<'
          if (beam.x < width - 1) {
            const newBeam: Beam = { ...beam, direction: '>' }
            beams.push(newBeam)
          }
        }
      }
    }
  }

  // printGrid(energyGrid)
  let total = 0
  for (const row of energyGrid) {
    for (const char of row) {
      if (char === '#') total++
    }
  }
  if (total > maxCount) maxCount = total
}

const main = () => {
  const lines = getInput('input.txt')

  height = lines.length
  width = lines[0].length

  for (let x = 0; x < width; x++) {
    count(lines, { x, y: 0, direction: 'v' })
    count(lines, { x, y: height - 1, direction: '^' })
  }

  for (let y = 0; y < height; y++) {
    count(lines, { x: 0, y, direction: '>' })
    count(lines, { x: width - 1, y, direction: '<' })
  }

  return maxCount
}

export { main }
