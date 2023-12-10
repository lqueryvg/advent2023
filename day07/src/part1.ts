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

const readableCardToSortableMap: Record<string, string> = {
  A: 'a',
  K: 'b',
  Q: 'c',
  J: 'd',
  T: 'e',
  '9': 'f',
  '8': 'g',
  '7': 'h',
  '6': 'i',
  '5': 'j',
  '4': 'k',
  '3': 'l',
  '2': 'm',
}

const sortableCardToReadableMap: Record<string, string> = {
  a: 'A',
  b: 'K',
  c: 'Q',
  d: 'J',
  e: 'T',
  f: '9',
  g: '8',
  h: '7',
  i: '6',
  j: '5',
  k: '4',
  l: '3',
  m: '2',
}

const handStrengths: Record<string, string> = {}

const getHandStrength = (hand: string) => {
  /*
    Five of a kind: AAAAA 5
    Four of a kind: AA8AA 41
    Full house: 23332 32
    Three of a kind: TTT98 311
    Two pair: 23432 221
    One pair: A23A4 2111
    High card: 23456 11111

    11111
    2111
    221
    311
    32
    41
    5
  */
  const counts: Record<string, number> = {}
  hand.split('').map((card: string) => {
    if (card in counts) {
      counts[card]++
    } else {
      counts[card] = 1
    }
  })
  const strength = Object.values(counts)
    .map((n) => n.toString())
    .sort()
    .reverse()
    .join('')
  handStrengths[hand] = strength
  return strength
}

const translateReadableHandToSortable = (hand: string) => {
  return hand
    .split('')
    .map((card: string) => readableCardToSortableMap[card])
    .join('')
}

const translateSortableHandToReadable = (hand: string) => {
  return hand
    .split('')
    .map((card: string) => sortableCardToReadableMap[card])
    .join('')
}

const main = () => {
  const lines = getInput('input.txt')
  const bids: Record<string, number> = {}
  const cards: string[] = []
  for (const line of lines) {
    const [hand, bid] = line.split(' ')
    bids[hand] = parseInt(bid)
    cards.push(translateReadableHandToSortable(hand))
  }

  const sorted = cards
    .sort((a, b) => {
      const as = getHandStrength(a)
      const bs = getHandStrength(b)
      const comp1 = -as.localeCompare(bs)
      if (comp1) return comp1
      const comp2 = a.localeCompare(b)
      return comp2
    })
    .reverse()

  let total = 0
  let rank = 1
  sorted.map((hand) => {
    const readable = translateSortableHandToReadable(hand)
    total += bids[readable] * rank
    rank++
  })

  return total
}

export { main }
