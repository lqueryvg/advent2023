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

const intersect = (
  setA: Set<string>,
  setB: Set<string>,
  ...args: Set<string>[]
): Set<string> => {
  const result = new Set([...setA].filter((i) => setB.has(i)))
  if (args.length === 0) return result
  return intersect(result, args.shift()!, ...args)
}

const main = () => {
  const lines = getInput('input.txt')
  let total = 0
  for (const line of lines) {
    const [_, cardContents] = line.split(/: +/)
    const [winningNumbersString, myNumbersString] = cardContents.split(/ +\| +/)
    const winningNumbers = new Set(winningNumbersString.split(/ +/))
    const myNumbers = new Set(myNumbersString.split(' '))
    const myWinningNumbers = intersect(winningNumbers, myNumbers)
    const numWinners = myWinningNumbers.size
    // console.log({ line, numWinners })
    if (numWinners > 0) {
      total += Math.pow(2, numWinners - 1)
    }
  }

  return total
}

export { main }
