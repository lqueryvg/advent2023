import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

const hash = (word: string) => {
  let wordTotal = 0
  for (const letter of word) {
    wordTotal += letter.charCodeAt(0)
    wordTotal *= 17
    wordTotal %= 256
  }
  return wordTotal
}

type Lens = {
  label: string
  focalLength: number
}

const findLensIndex = (lenses: Lens[], label: string): number => {
  return lenses.findIndex((l: Lens) => l.label === label)
}

const removeLens = (lenses: Lens[], label: string): Lens[] => {
  return lenses.filter((l: Lens) => l.label !== label)
}

// const printBoxes = (boxes: Lens[][]) => {
//   for (let i = 0; i < boxes.length; i++) {
//     const box = boxes[i]
//     if (box.length !== 0) {
//       console.log({ i, box })
//     }
//   }
// }

const main = () => {
  const lines = getInput('input.txt')
  const line = lines.shift()!

  const words = line.split(',')
  const boxes: Lens[][] = []
  for (let i = 0; i < 256; i++) {
    boxes.push([] as Lens[])
  }

  for (const word of words) {
    let [label, focalLengthText] = word.split('=')

    if (focalLengthText === undefined) {
      // operation -
      label = label.substring(0, label.length - 1)
      const boxNumber = hash(label)
      const lenses = boxes[boxNumber]
      boxes[boxNumber] = removeLens(lenses, label)
    } else {
      // operation =
      const boxNumber = hash(label)
      const focalLength = parseInt(focalLengthText)
      const lenses = boxes[boxNumber]
      const lensIndex = findLensIndex(lenses, label)
      if (lensIndex === -1) {
        lenses.push({ label, focalLength })
      } else {
        lenses[lensIndex] = { label, focalLength }
      }
    }
  }

  let total = 0
  for (let boxIndex = 0; boxIndex < 256; boxIndex++) {
    const lenses = boxes[boxIndex]
    for (let lensIndex = 0; lensIndex < lenses.length; lensIndex++) {
      const lens = lenses[lensIndex]
      total += (1 + boxIndex) * (lensIndex + 1) * lens.focalLength
    }
  }

  return total
}

export { main }
