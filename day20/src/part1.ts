import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

type Inputs = Record<string, boolean>
type Prefix = '&' | '%'
type FlipFlop = { prefix: '%'; state: boolean }
type Conjunction = { prefix: '&'; inputs: Inputs }
type ModuleBase = {
  prefix: Prefix
  targets: string[]
}
type Module = ModuleBase & (FlipFlop | Conjunction)
type Pulse = {
  targetModuleName: string
  value: boolean
  from: string
}

const main = () => {
  const lines = getInput('input.txt')

  const modules: Record<string, Module> = {}
  const pulseQueue: Pulse[] = []
  const broadcasterTargets: string[] = []

  for (const line of lines) {
    const match = line.match(/([%&]*)(\S+) -> (.*)/)
    const [_, prefix, name, targetsText] = match!
    // console.log({ prefix, name, targetsText })
    const targets = targetsText.split(', ')
    if (name === 'broadcaster') {
      targets.map((targetModuleName) =>
        broadcasterTargets.push(targetModuleName)
      )
    } else {
      switch (prefix) {
        case '%':
          modules[name] = {
            prefix,
            targets,
            state: false,
          }
          break
        case '&':
          modules[name] = {
            prefix,
            targets,
            inputs: {},
          }
          break
        default:
          throw new Error('unexpected prefix')
      }
    }
  }

  // initialise inputs of conjunction modules
  for (const moduleName in modules) {
    for (const targetModuleName of modules[moduleName].targets) {
      const targetModule = modules[targetModuleName]
      if (targetModule === undefined) continue
      if (targetModule.prefix === '&') {
        targetModule.inputs[moduleName] = false
      }
    }
  }

  const allTrue = (inputs: Inputs): boolean => {
    for (const input in inputs) {
      if (!inputs[input]) return false
    }
    return true
  }

  let lowPulses = 0
  let highPulses = 0

  for (let buttonPress = 1; buttonPress <= 1000; buttonPress++) {
    // console.log({ buttonPress })
    broadcasterTargets.map((targetModuleName) =>
      pulseQueue.push({
        targetModuleName,
        value: false,
        from: 'broadcaster',
      })
    )
    lowPulses += 1 + broadcasterTargets.length
    while (true) {
      const pulse = pulseQueue.pop()
      if (!pulse) break

      const thisModuleName = pulse.targetModuleName
      // console.log(`${pulse.from} -${pulse.value}-> ${thisModuleName}`)

      const m = modules[pulse.targetModuleName]
      if (m === undefined) continue

      const countPulse = (state: boolean): void => {
        state ? highPulses++ : lowPulses++
        return
      }

      const newPulses: Pulse[] = []
      switch (m.prefix) {
        case '%':
          if (!pulse.value) {
            m.state = !m.state
            m.targets.map((target) => {
              newPulses.push({
                targetModuleName: target,
                value: m.state,
                from: thisModuleName,
              })
              countPulse(m.state)
            })
          }
          break
        case '&':
          m.inputs[pulse.from] = pulse.value
          const value = !allTrue(m.inputs)
          m.targets.map((target) => {
            newPulses.push({
              targetModuleName: target,
              value,
              from: thisModuleName,
            })
            countPulse(value)
          })
          break
      }
      pulseQueue.unshift(...newPulses)
    }
  }
  console.log({ highPulses, lowPulses })

  return highPulses * lowPulses
}

export { main }
