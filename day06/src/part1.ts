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
      for (const timeText of timesText) {
        raceTimes.push(parseInt(timeText))
      }
    }
    if (line.match(/Distance:/)) {
      const recordsText = line.split(/\s+/).values()
      recordsText.next()
      for (const timeText of recordsText) {
        raceRecords.push(parseInt(timeText))
      }
    }

    // if (line === '') continue // skip blank lines
  }
  return raceTimes.map((raceTime, i) => {
    return { time: raceTime, record: raceRecords[i] }
  })
  // return lines
}

const main = () => {
  const races = getInput('input.txt')
  // console.log({ races })

  const ways: number[] = []

  for (const race of races) {
    // console.log({ race })
    let numWays = 0
    for (let time = 0; time <= race.time; time++) {
      const distance = time * (race.time - time)
      const recordBroken = distance > race.record
      // console.log({ time, distance, recordBroken })
      if (recordBroken) {
        numWays++
      }
    }

    ways.push(numWays)
  }

  return ways.reduce((a, b) => a * b)
}

export { main }
