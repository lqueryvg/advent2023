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

const isDigit = (character: string) => {
  const code = character.codePointAt(0)
  return 47 < code! && code! < 58
}

const isGear = (character: string) => {
  return character === '*'
}

const main = () => {
  const lines = getInput('input.txt')

  const getCharAt = (x: number, y: number) => {
    if (y < 0 || y + 1 >= lines.length || x < 0 || x + 1 >= lines[0].length)
      return '.'
    return lines[y][x]
  }

  const getGearLocation = (x: number, y: number) => {
    if (isGear(getCharAt(x - 1, y - 1))) return `${y - 1},${x - 1}`
    if (isGear(getCharAt(x - 1, y))) return `${y},${x - 1}`
    if (isGear(getCharAt(x - 1, y + 1))) return `${y + 1},${x - 1}`
    if (isGear(getCharAt(x + 1, y - 1))) return `${y - 1},${x + 1}`
    if (isGear(getCharAt(x + 1, y))) return `${y},${x + 1}`
    if (isGear(getCharAt(x + 1, y + 1))) return `${y + 1},${x + 1}`
    if (isGear(getCharAt(x, y - 1))) return `${y - 1},${x}`
    if (isGear(getCharAt(x, y + 1))) return `${y + 1},${x}`
    return ''
  }

  const gears: Record<string, number[]> = {}

  const addGearNumber = (gearLocation: string, number: number) => {
    if (gearLocation === '') return
    if (gears[gearLocation] === undefined) {
      gears[gearLocation] = [number]
      return
    }
    gears[gearLocation].push(number)
  }

  let y = 0
  for (const line of lines) {
    let x = 0
    let number: number = 0
    let gearLocation = ''
    for (const character of line) {
      if (isDigit(character)) {
        number = number * 10 + parseInt(character)
        if (gearLocation === '') {
          gearLocation = getGearLocation(x, y)
        }
      } else {
        addGearNumber(gearLocation, number)
        number = 0
        gearLocation = ''
      }
      x++
    }
    addGearNumber(gearLocation, number)
    y++
  }

  let total = 0

  for (const gearLocation in gears) {
    if (gears[gearLocation].length !== 1) {
      total += gears[gearLocation][0] * gears[gearLocation][1]
    }
  }

  return total
}

export { main }
