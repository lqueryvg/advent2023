import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

const main = () => {
  const lines = getInput('input.txt')
  const line = lines.shift()!

  const words = line.split(',')
  let total = 0
  for (const word of words) {
    let wordTotal = 0
    for (const letter of word) {
      wordTotal += letter.charCodeAt(0)
      wordTotal *= 17
      wordTotal %= 256
    }
    total += wordTotal
  }

  return total
}

export { main }
