import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

type Directions = {
  [direction: string]: string
}
const map: Record<string, Directions> = {}

const main = () => {
  const lines = getInput('input.txt').values()

  const directions: string = lines.next().value
  lines.next().value // skip blank line

  for (const line of lines) {
    const match = line.match(/(...) = \((...), (...)\)/)
    const [_, start, L, R] = match!
    map[start] = { L, R }
  }

  let directionIndex = 0
  let currentNode = 'AAA'
  let steps = 0

  while (currentNode !== 'ZZZ') {
    const direction = directions.charAt(directionIndex) as 'L' | 'R'
    steps++
    currentNode = map[currentNode][direction]
    directionIndex++
    if (directionIndex === directions.length) {
      directionIndex = 0
    }
  }

  return steps
}

export { main }
