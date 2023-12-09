import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  // or other processing...
  type Race = { time: number; distance: number }
  const raceTimes: number[] = []
  const raceRecords: number[] = []
  for (const line of lines) {
    if (line.match(/Time:/)) {
      const timesText = line.split(/\s+/).values()
      timesText.next()
      raceTimes.push(parseInt([...timesText].join('')))
    }
    if (line.match(/Distance:/)) {
      const recordsText = line.split(/\s+/).values()
      recordsText.next()
      raceRecords.push(parseInt([...recordsText].join('')))
    }
  }
  return raceTimes.map((raceTime, i) => {
    return { time: raceTime, record: raceRecords[i] }
  })
}

const main = () => {
  const races = getInput('input.txt')

  const ways: number[] = []

  for (const race of races) {
    const root = Math.sqrt(race.time * race.time - 4 * race.record)
    const way1 = Math.round((race.time + root) / 2)
    const way2 = Math.round((race.time - root) / 2)

    const nway1 = Math.max(
      ...[way1 - 1, way1, way1 + 1].filter((time) => {
        const distance = time * (race.time - time)
        return distance > race.record
      })
    )

    const nway2 = Math.min(
      ...[way2 - 1, way2, way2 + 1].filter((time) => {
        const distance = time * (race.time - time)
        return distance > race.record
      })
    )

    const nways = Math.abs(nway1 - nway2) + 1
    ways.push(nways)
  }

  return ways.reduce((a, b) => a * b)
}

export { main }
