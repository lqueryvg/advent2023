import { copyFile, readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  // or other processing...
  // for (const line of lines) {
  //   if (line === '') continue // skip blank lines
  // }
  return lines
}

type Category = 'x' | 'm' | 'a' | 's'
type Comparator = '<' | '>'
type Rule =
  | {
      category: Category
      comparator: Comparator
      value: number
      targetWorkflow: string
    }
  | string
type Workflow = Rule[]

const main = () => {
  const lines = getInput('input.txt').values()

  const workflows: Record<string, Workflow> = {}
  // rules
  for (const line of lines) {
    if (line === '') break
    const match = line.match(/(\S+){(\S+)}/)
    const [_, workflowName, rules] = match!
    const workflow: Workflow = []
    for (const rule of rules.split(',')) {
      const match = rule.match(/(\S+)([<>])(\d+):(\S+)/)
      if (!match) workflow.push(rule)
      else {
        const [_, category, comparator, value, targetWorkflow] = match!
        workflow.push({
          category: category as Category,
          comparator: comparator as Comparator,
          value: parseInt(value),
          targetWorkflow,
        })
      }
      workflows[workflowName] = workflow
    }
  }
  // console.log({ workflows })

  workflows['A'] = ['A']
  workflows['R'] = ['R']

  let total = 0

  // ratings
  type Part = Record<Category, number>
  nextPart: for (const line of lines) {
    const part: Part = {} as Part
    const match = line.match(/{(\S+)}/)
    const [_, ratings] = match!
    for (const rating of ratings.split(',')) {
      // console.log({ rating })
      const [category, value] = rating.split('=')
      part[category as Category] = parseInt(value)
    }
    console.log({ part })

    let workflowName = 'in'
    nextWorkflow: while (true) {
      // console.log({ workflowName })
      const rules = workflows[workflowName]
      for (const rule of rules) {
        if (typeof rule === 'string') {
          // console.log({ rule })
          switch (rule) {
            case 'A':
              // console.log('accept')
              total += part['x'] + part['m'] + part['a'] + part['s']
              continue nextPart
            case 'R':
              // console.log('reject')
              continue nextPart
          }
          // console.log('next workflow')
          workflowName = rule
          continue nextWorkflow
        }
        // console.log({ rule })

        if (!'<>'.includes(rule.comparator)) {
          throw new Error('invalid comparator')
        }
        if (
          (rule.comparator === '<' && part[rule.category] < rule.value) ||
          (rule.comparator === '>' && part[rule.category] > rule.value)
        ) {
          workflowName = rule.targetWorkflow
          // console.log({ next: workflowName })
          continue nextWorkflow
        }
        // console.log('next rule')
      }
      break
    }
  }

  return total
}

export { main }
