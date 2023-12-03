import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

const numbers: Record<string, number> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
}

const stringToNumber = (s: string) => {
  return numbers[s]
}

const main = () => {
  const data = getInput('input.txt')
  let total = 0
  for (const line of data) {
    // console.log({ line })

    let result: RegExpExecArray | null = null
    let lineResult = 0

    result =
      /^.*?([1-9]|one|two|three|four|five|six|seven|eight|nine).*([1-9]|one|two|three|four|five|six|seven|eight|nine).*?$/.exec(
        line
      )
    if (result) {
      lineResult = 10 * stringToNumber(result[1]) + stringToNumber(result[2])
    } else {
      result = /([1-9]|one|two|three|four|five|six|seven|eight|nine).*?$/.exec(
        line
      )
      lineResult = 10 * stringToNumber(result![1]) + stringToNumber(result![1])
    }
    total += lineResult
  }

  return total
}

export { main }
