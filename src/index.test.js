import merge from './'
import remark from 'remark'

// prettier-ignore
const data = `
# Title

Content...

> Quote text 1

> Quote text 2

Some paragraph...

> Quote text 3

Another paragraph...

> Quote text 4

> Quote text 5

> Quote text 6

More paragraphs...

\`\`\`
const param1 = true
\`\`\`

\`\`\`
const param2 = true
\`\`\`

\`\`\`
const param3 = true
\`\`\`

Another paragraph

\`\`\`
const param4 = true
\`\`\`

\`\`\`
const param5 = true
\`\`\`

Anoter paragraph

\`\`\`
const end = true
\`\`\`

Last paragraph
`

function parse(data, options) {
  return remark()
    .use(merge, options)
    .use({ settings: { fences: true } })
    .processSync(data)
    .toString()
}

test('defined', () => {
  expect(merge).toBeDefined()
  expect(typeof merge).toBe('function')
})

test('ignores types that not in whitelist', () => {
  const markdown = parse(data, { types: ['image'] })
  expect(markdown).toMatchSnapshot()
})

test('merges default types', () => {
  const markdown = parse(data)
  expect(markdown).toMatchSnapshot()
})

test('merges only `code` blocks', () => {
  const markdown = parse(data, { types: ['code'] })
  expect(markdown).toMatchSnapshot()
})

test('ignores line breaks in `devider` option', () => {
  const markdown = parse(data, { devider: '---\n\n' })
  expect(markdown).toMatchSnapshot()
})
