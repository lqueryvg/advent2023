import { copyFile, readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
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
        const [_, category, comparator, value, targetWorkflow] = match
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

  let total = 0
  type Range = {
    floor: number
    ceil: number
  }
  const getRangesProduct = (ranges: Ranges) => {
    return (
      (ranges.x.ceil - ranges.x.floor + 1) *
      (ranges.m.ceil - ranges.m.floor + 1) *
      (ranges.a.ceil - ranges.a.floor + 1) *
      (ranges.s.ceil - ranges.s.floor + 1)
    )
  }
  type Ranges = {
    x: Range
    m: Range
    a: Range
    s: Range
  }
  type Node = {
    workflowName: string
    ranges: Ranges
  }
  const rangeTemplate: Range = { floor: 1, ceil: 4000 }
  const rangesTemplate: Ranges = {
    x: { ...rangeTemplate },
    m: { ...rangeTemplate },
    a: { ...rangeTemplate },
    s: { ...rangeTemplate },
  }
  const nodes: Node[] = []
  nodes.push({ workflowName: 'in', ranges: { ...rangesTemplate } })

  const copyRanges = (ranges: Ranges): Ranges => {
    return JSON.parse(JSON.stringify(ranges)) as Ranges
  }

  nextNode: while (true) {
    const node = nodes.pop()
    if (!node) break
    const workflow = workflows[node.workflowName]
    nextRule: for (const rule of workflow) {
      if (typeof rule === 'string') {
        switch (rule) {
          case 'R':
            break
          case 'A':
            total += getRangesProduct(node.ranges)
            break
          default:
            nodes.push({ workflowName: rule, ranges: copyRanges(node.ranges) })
        }
        continue nextNode
      }
      // comparator
      if (!'<>'.includes(rule.comparator)) {
        throw new Error('invalid comparator')
      }
      const newRanges = copyRanges(node.ranges)
      if (rule.comparator === '>') {
        // true
        if (newRanges[rule.category].floor <= rule.value) {
          newRanges[rule.category].floor = rule.value + 1
        }
        // false
        if (node.ranges[rule.category].ceil > rule.value) {
          node.ranges[rule.category].ceil = rule.value
        }
      }
      if (rule.comparator === '<') {
        // true
        if (newRanges[rule.category].ceil >= rule.value) {
          newRanges[rule.category].ceil = rule.value - 1
        }
        // false
        if (node.ranges[rule.category].floor < rule.value) {
          node.ranges[rule.category].floor = rule.value
        }
      }
      if (rule.targetWorkflow === 'A') {
        total += getRangesProduct(newRanges)
        continue nextRule
      }
      if (rule.targetWorkflow === 'R') {
        continue nextRule
      }
      // target is a workflow
      nodes.push({ workflowName: rule.targetWorkflow, ranges: newRanges })
    }
  }

  return total
}

export { main }
