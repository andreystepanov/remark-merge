# remark-merge

> [remark](https://github.com/remarkjs/remark) plugin to merge two or more consecutive `blockquote` or `code` elements into one

## Installation

```
npm install remark-merge --save
```

## Usage

Say we have the following file, `example.md`:

````markdown
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

```javascript
const param1 = true
```

```javascript
const param2 = true
```

```javascript
const param3 = true
```

Another paragraph

```javascript
const param4 = true
```

```javascript
const param5 = true
```

Anoter paragraph

```javascript
const end = true
```

Last paragraph
````

And our script, `example.js`, looks as follows:

```javascript
const vfile = require('to-vfile')
const remark = require('remark')
const merge = require('remark-merge')

const options = {
  types: ['blockquote', 'code'],
  devider: null,
}

const markdown = remark()
  .use(merge, options)
  .process(vfile.readSync('example.html'), function (err, file) {
    if (err) throw err
    console.log(String(file))
  })
```

Now, running `node example` yields:

````markdown
# Title

Content...

> Quote text 1
>
> Quote text 2

Some paragraph...

> Quote text 3

Another paragraph...

> Quote text 4
>
> Quote text 5
>
> Quote text 6

More paragraphs...

```javascript
const param1 = true

const param2 = true

const param3 = true
```

Another paragraph

```javascript
const param4 = true

const param5 = true
```

Anoter paragraph

```javascript
const end = true
```

Last paragraph
````

If `devider` option is provided, then merged blocks will be devided with provided string (in our example it's `---`):

````
...

> Quote text 4
>
> ---
>
> Quote text 5
>
> ---
>
> Quote text 6

More paragraphs...

```javascript
const param1 = true

---

const param2 = true

---

const param3 = true
```
...

````

## Options

`types` - `array` - One of the defaults, or both. Default is `[ 'blockquote', 'code' ]`
`devider` - `string` - Sting that will devide blocks. Line break will be ignored. Default is empty string.
