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

  type Range = { start: number; end: number }

  let seedRanges: Range[] = []

  const seedTextIterator = seedsText.split(' ').values()
  for (const seedText of seedTextIterator) {
    if (seedText == 'seeds:') continue
    const [start, length] = [
      parseInt(seedText),
      parseInt(seedTextIterator.next().value),
    ]
    seedRanges.push({ start, end: start + length - 1 })
  }

  type Mapping = {
    src: Range
    dst: Range
  }

  let targetRanges: Mapping[]

  const newRange = (s: number, e: number) => {
    return { start: s, end: e }
  }

  const rangeToString = (r: Range) => {
    return `${r.start},${r.end}`
  }

  const doMapping = () => {
    const newSeedRanges: Record<string, Range> = {}
    nextSeedRange: for (const seedRange of seedRanges) {
      for (const targetRange of targetRanges) {
        const s = seedRange
        const t = targetRange.src
        const delta = targetRange.dst.start - targetRange.src.start
        // entire range is below or above
        if (s.end < t.start || s.start > t.end) {
          continue
        }

        // split bottom
        if (s.start < t.start && s.end >= t.start) {
          seedRanges.push(newRange(s.start, t.start - 1))
        }

        // split top
        if (s.start <= s.end && s.end > t.end) {
          seedRanges.push(newRange(t.end + 1, s.end))
        }

        // overlap
        const overlapRange = newRange(
          Math.max(s.start, t.start) + delta,
          Math.min(s.end, t.end) + delta
        )
        newSeedRanges[rangeToString(overlapRange)] = overlapRange
        continue nextSeedRange
      }
      newSeedRanges[rangeToString(seedRange)] = seedRange
    }
    seedRanges = [...Object.values(newSeedRanges)]
  }

  const targetStarts: number[] = []
  let _skipline = lines.next() // skip blank line
  for (const [_skip, line] of lines) {
    if (line.match(/map:/)) {
      targetRanges = []
      continue
    }

    if (line !== '') {
      // reading map
      const [destStart, sourceStart, length] = line
        .split(' ')
        .map((x) => parseInt(x))
      targetRanges!.push({
        src: { start: sourceStart, end: sourceStart + length - 1 },
        dst: { start: destStart, end: destStart + length - 1 },
      })
    } else {
      doMapping()
    }
  }
  doMapping()

  const lowestLocation = Math.min(
    ...seedRanges.map((s) => {
      return s.start
    })
  )

  return lowestLocation
}

export { main }
