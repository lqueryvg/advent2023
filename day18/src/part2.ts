import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  return file.split(/\r\n|\n/)
}

type Point = [number, number]

function shoelace(nodes: Point[]): number {
  const n = nodes.length
  if (n < 3) return 0
  let area = 0
  for (let i = 0; i < n - 1; i++) {
    area += nodes[i][0] * nodes[i + 1][1] - nodes[i + 1][0] * nodes[i][1]
  }
  // last edge
  area += nodes[n - 1][0] * nodes[0][1] - nodes[0][0] * nodes[n - 1][1]
  return Math.abs(area) / 2.0
}

const main = () => {
  const lines = getInput('input.txt')

  let x = 0
  let y = 0
  const nodes: Point[] = [[0, 0]]
  let drawLength = 0
  for (const line of lines) {
    const match = line.match(/\S+ \d+ \(#(\S{5})(\d)\)/)
    const [_, distanceHex, direction] = match!
    const distance = parseInt(distanceHex, 16)

    switch (direction) {
      case '0': // R
        x += distance
        break
      case '1': // D
        y += distance
        break
      case '2': // L
        x -= distance
        break
      case '3': // U
        y -= distance
        break
    }
    nodes.push([x, y])
    drawLength += distance
  }
  return shoelace(nodes) + drawLength / 2 + 1
}

export { main }
