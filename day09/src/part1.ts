import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  // or other processing...
  // for (const line of lines) {
  //   if (line === '') continue // skip blank lines
  // }
  return lines
}

const getLast = (numbers: number[]): number => {
  return numbers[numbers.length - 1]
}

const getDifferences = (numbers: number[]): number[] => {
  const differences: number[] = []
  for (const [index, value] of numbers.entries()) {
    if (index === numbers.length - 1) break
    differences.push(numbers[index + 1] - value)
  }
  return differences
}

const allZero = (numbers: number[]): boolean => {
  const found = numbers.find((n) => n !== 0)
  return found === undefined
}

const getNext = (numbers: number[]): number => {
  if (allZero(numbers)) return 0
  const differences = getDifferences(numbers)
  return getLast(numbers) + getNext(differences)
}

const main = () => {
  const lines = getInput('input.txt')

  let total = 0
  for (const line of lines) {
    const numbers = line.split(' ').map((s) => parseInt(s))
    total += getNext(numbers)
  }

  return total
}

export { main }
