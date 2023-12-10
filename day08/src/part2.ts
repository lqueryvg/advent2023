import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b)
const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

type Directions = {
  [direction: string]: string
}
const map: Record<string, Directions> = {}

const main = () => {
  const lines = getInput('input.txt').values()

  const directions: string = lines.next().value
  lines.next().value // skip blank line

  let startNodes: string[] = []
  for (const line of lines) {
    const match = line.match(/(...) = \((...), (...)\)/)
    const [_, start, L, R] = match!
    map[start] = { L, R }
    if (start.endsWith('A')) {
      startNodes.push(start)
    }
  }

  const countSteps = (start: string) => {
    let directionIndex = 0
    let currentNode = start
    let steps = 0

    while (!currentNode.endsWith('Z')) {
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

  return startNodes.map((n) => countSteps(n)).reduce(lcm)
}

export { main }
