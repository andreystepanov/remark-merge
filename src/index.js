import visit from 'unist-util-visit'
import remove from 'unist-util-remove'

const whitelist = ['blockquote', 'code']

export default function merge(options) {
  const { types = whitelist, devider = '' } = options || {}

  return function transform(tree, vfile) {
    const elements = types.filter(t => whitelist.includes(t))

    if (elements.length < 1) {
      return tree
    }

    elements.map(type => {
      join(
        tree,
        type,
        devider ? devider.replace(/(?:\r\n|\r|\n)/g, '') : undefined,
      )
    })
  }
}

function join(tree, type, devider) {
  const nodes = {}

  visit(tree, type, (node, index, parent) => {
    nodes[index] = node
  })

  let indexes = []

  Object.keys(nodes).map(index => {
    const idx = Number(index)
    const next = idx + 1

    if (nodes[idx] && nodes[next]) {
      indexes.push(idx)
      indexes.push(next)
    }
  })

  indexes = [...new Set(indexes)].sort((a, b) => a - b)

  const groups = groupConsecutive(indexes)
  const toRemove = []

  groups.map(([first, ...rest]) => {
    const parent = nodes[first]

    rest.map(next => {
      const node = nodes[next]

      toRemove.push(next)

      if (parent.children) {
        parent.children = parent.children.concat(
          devider ? [{ type: 'text', value: devider }] : [],
          node.children,
        )
      } else {
        parent.value += `\n\n${devider ? `${devider}\n\n` : ''}${node.value}`
      }
    })
  })

  remove(tree, (node, index) => {
    if (node.type !== type) {
      return false
    }

    return toRemove.includes(index)
  })
}

function groupConsecutive(numbers = [], minLength = 2) {
  const groups = {}

  numbers.map(index => {
    const prev = index - 1
    if (groups[prev]) {
      groups[index] = [...groups[prev], index]
      delete groups[prev]
    } else {
      groups[index] = [index]
    }
  })

  return Object.values(groups).filter(a => a.length >= minLength)
}
