import { readFileSync } from 'fs'

const main = () => {
  const lines = readFileSync('input.txt', 'utf-8')
    .trim()
    .split(/\r\n|\n/)

  for (const line of lines) {
    const match = line.match(/(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)/)
    const coords = match?.slice(1, 7).map((x) => parseInt(x))
    const [x1, y1, z1, x2, y2, z2] = coords!
    const [dx, dy, dz] = [
      Math.abs(x1 - x2),
      Math.abs(y1 - y2),
      Math.abs(z1 - z2),
    ]
    // check orthogonal
    const numZeros = [dx, dy, dz].filter((x) => x === 0).length
    if (numZeros < 2) throw new Error(`wonky brick ${line}`)
  }

  return 'TBD'
}

export { main }
