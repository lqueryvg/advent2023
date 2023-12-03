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

type Colours = {
  red: number
  blue: number
  green: number
}

const isPossible = (maxColours: Colours, boundaryColours: Colours) => {
  return (
    maxColours['red'] <= boundaryColours['red'] &&
    maxColours['green'] <= boundaryColours['green'] &&
    maxColours['blue'] <= boundaryColours['blue']
  )
}

const main = () => {
  const data = getInput('input.txt')
  let total = 0

  for (const line of data) {
    // console.log({ line })
    const [gameTitle, draws] = line.split(': ')
    const gameNumber = Number(gameTitle.split(' ')[1])
    // console.log({ draws, gameNumber })
    const maxColours = { red: 0, blue: 0, green: 0 }
    for (const draw of draws.split('; ')) {
      // console.log({ draw })
      for (const colourString of draw.split(', ')) {
        const [count, colourName] = colourString.split(' ')
        if (maxColours[colourName as keyof Colours] < Number(count))
          maxColours[colourName as keyof Colours] = Number(count)
      }
    }
    // console.log({ maxColours })
    if (isPossible(maxColours, { red: 12, green: 13, blue: 14 })) {
      total += gameNumber
    }
  }

  return total
}

export { main }
