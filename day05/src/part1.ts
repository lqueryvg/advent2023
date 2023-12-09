import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

const main = () => {
  const data = getInput('input.txt')

  const lines = data.entries()

  const {
    value: [_, seedsText],
  } = lines.next()
  // console.log({ seedsText })

  const sourceNumbers: number[] = []
  for (const seedText of seedsText.split(' ')) {
    if (seedText !== 'seeds:') {
      sourceNumbers.push(parseInt(seedText))
    }
  }
  // console.log({ sourceNumbers })

  type MapRange = {
    destStart: number
    sourceStart: number
    length: number
  }

  let ranges: MapRange[]

  const mapNumber = (sourceNumber: number) => {
    for (const range of ranges) {
      if (
        sourceNumber >= range.sourceStart &&
        sourceNumber <= range.sourceStart + range.length
      ) {
        return range.destStart + sourceNumber - range.sourceStart
      }
    }
    return sourceNumber
  }

  const mapSourceNumbers = () => {
    sourceNumbers.forEach((sourceNumber: number, index: number) => {
      sourceNumbers[index] = mapNumber(sourceNumber)!
    })
    // console.log({ sourceNumbers })
  }

  let _skipline = lines.next() // skip blank line
  for (const [_skip, line] of lines) {
    if (line.match(/map:/)) {
      ranges = []
      continue
    }

    // console.log({ line })
    if (line !== '') {
      const [destStart, sourceStart, length] = line
        .split(' ')
        .map((x) => parseInt(x))
      ranges!.push({ destStart, sourceStart, length })
    } else {
      mapSourceNumbers()
    }
  }
  mapSourceNumbers()

  return Math.min(...sourceNumbers)
}

export { main }
