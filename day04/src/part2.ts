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
  // https://stackoverflow.com/a/70291510/2964461
  setA: Set<string>,
  setB: Set<string>,
  ...args: Set<string>[]
): Set<string> => {
  const result = new Set([...setA].filter((i) => setB.has(i)))
  if (args.length === 0) return result
  return intersect(result, args.shift()!, ...args)
}

// const cardCounts: Record<string, number> = {}
const cardCounts: number[] = []

const addToCardCount = (cardNumber: number, add: number) => {
  // console.log('incrementing', { cardNumber })
  if (cardCounts[cardNumber - 1] === undefined) {
    cardCounts[cardNumber - 1] = add
  } else {
    cardCounts[cardNumber - 1] += add
  }
}

const main = () => {
  const lines = getInput('input.txt')

  let cardNumber = 1
  for (const line of lines) {
    const [_, cardContents] = line.split(/: +/)

    const [winningNumbersString, myNumbersString] = cardContents.split(/ +\| +/)
    const winningNumbers = new Set(winningNumbersString.split(/ +/))
    const myNumbers = new Set(myNumbersString.split(' '))

    const myWinningNumbers = intersect(winningNumbers, myNumbers)
    addToCardCount(cardNumber, 1)
    const numWinners = myWinningNumbers.size
    let nextCardNumber = cardNumber + 1
    while (
      nextCardNumber <= cardNumber + numWinners &&
      nextCardNumber <= lines.length
    ) {
      addToCardCount(nextCardNumber, cardCounts[cardNumber - 1])
      nextCardNumber++
    }
    cardNumber++
  }

  return cardCounts.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  )
}

export { main }
