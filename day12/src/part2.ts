import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

let springWidth = 1

const findWays = (springs: string, groupSizes: number[]): number => {
  // console.log('findWays() called', {
  //   springs: springs.padStart(springWidth),
  //   groupSizes,
  // })

  if (groupSizes.length === 0) {
    return springs.match(/#/) ? 0 : 1
  }

  // strip leading dots
  const remainingSprings = springs.replace(/^\.+/, '')
  if (remainingSprings === '') {
    return 0
  }

  const remainingGroupSizes = [...groupSizes]
  const currentGroupSize = remainingGroupSizes.shift()
  if (currentGroupSize === undefined) {
    // we've found a place for all groups, so we've found 1 way
    return 1
  }

  // get possible group length
  const matchGroups = remainingSprings.match(/([?#]+)[^.]*/g)
  if (!matchGroups) {
    return 0
  }

  let numWays = 0
  // try to fit next group
  if (
    matchGroups[0].length >= currentGroupSize &&
    remainingSprings[currentGroupSize] !== '#'
  ) {
    const nextSprings = `${remainingSprings.slice(currentGroupSize + 1)}`
    numWays += findWaysCached(nextSprings, remainingGroupSizes)
  }

  // try skipping this character if we can
  if (remainingSprings[0] === '?') {
    numWays += findWaysCached(`.${remainingSprings.slice(1)}`, groupSizes)
  }

  return numWays
}

const cache: Record<string, number> = {}

const findWaysCached = (springs: string, groupSizes: number[]): number => {
  const key = `${springs}:${groupSizes.join(',')}`
  if (key in cache) return cache[key]
  const n = findWays(springs, groupSizes)
  cache[key] = n
  return n
}

const main = () => {
  const lines = getInput('input.txt')

  let total = 0
  for (const line of lines) {
    const [springsText, groupsText] = line.split(' ')
    const springs = Array(5).fill(springsText).join('?')
    const groupsTextNew = Array(5).fill(groupsText).join(',')
    const groups = groupsTextNew.split(',').map((n) => parseInt(n))
    springWidth = springs.length
    const ways = findWays(springs, groups)
    // console.log({ springs, groups, ways })
    total += ways
  }

  return total
}

export { main }
