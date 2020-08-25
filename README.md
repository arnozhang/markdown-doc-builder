# markdown-doc-builder

Markdown documents builder. Can output .md and .html files

## 1. Usage

> npm install --save markdown-doc-builder

Using [markdown-doc-builder](https://www.npmjs.com/package/markdown-doc-builder) is quite easy:

```typescript
import markdown from 'markdown-doc-builder';


// output md
const markdownContent = markdown
    .newBuilder()
    .h1('Hello')
    .text('world')
    .toMarkdown();

// output HTML
const htmlContent = markdown
    .newBuilder()
    .h1('Hello')
    .text('world')
    .toHtml(markdown.defaultHtmlStyles());
```

## 2. API

### 2.1. Headers

Use the h1,h2,h3,h4,h5,h6 or header to generate a markdown header. Calling header with a level above 6 returns a h6 Header.

```typescript
import markdown from 'markdown-doc-builder';


markdown
    .newBuilder()
    .h1('Usage')
    .h2('API')
    .h3('Headers')
    .h3('Emphasis')
    .h3('Lists')
    .h3('Table')
    .toMarkdown();
```

### 2.2. Emphasis

```typescript
import markdown from 'markdown-doc-builder';


markdown
    .newBuilder()
    .bold('This is bold text')
    .italic('This is italic text')
    .boldItalic('This is bold-italic text')
    .strikethrough('This is strikethrough text');
```

### 2.3. Lists

```typescript
import markdown from 'markdown-doc-builder';


markdown
    .newBuilder()
    .list([ 'Java', 'JavaScript', 'TypeScript' ]);

markdown
    .newBuilder()
    .list([
        'Java', 'JavaScript', 'TypeScript',
        'Misc',
        markdown.newListBuilder().append('a', 'b', 'c'),
    ]);
```

### 2.4. Table

```typescript
import markdown from 'markdown-doc-builder';


const table = markdown
    .newTableBuilder(0, 2)
    .header([ 'Option', 'Description' ])
    .appendRow([ 'data', 'path to data files to supply the data that will be passed into templates.' ])
    .appendRow([ 'engine', 'engine to be used for processing templates. Handlebars is the default.' ])
    .appendRow([ 'ext', 'extension to be used for dest files.' ]));

markdown
    .newBuilder()
    .table(table)
    .toMarkdown();
```

### 2.5. Link

```typescript
import markdown from 'markdown-doc-builder';


markdown
    .newBuilder()
    .link('https://github.com/arnozhang/markdown-doc-builder', 'markdown-doc-builder')
    .toMarkdown();
```

### 2.5. Image

```typescript
import markdown from 'markdown-doc-builder';


markdown
    .newBuilder()
    .image('https://octodex.github.com/images/minion.png', 'Minion')
    .toMarkdown();
```

### 2.6. Code

```typescript
import markdown from 'markdown-doc-builder';


markdown
    .newBuilder()
    .compositeNodes(
        markdown.text('Inline '),
        markdown.code('code'))
    .toMarkdown();

markdown
    .newBuilder()
    .codeBlock(MarkdownCodeType.Json, JSON.stringify({
        name: 'Arno Zhang',
        github: 'https://github.com/arnozhang',
    }, null, 4))
    .toMarkdown();
```

## 3. Output HTML


```typescript
import markdown from 'markdown-doc-builder';


const styles = markdown
    .defaultStyles()
    .globalCss("body {color: #000; font-size: 15px;}");

const htmlContent = markdown
    .newBuilder()
    .xxx()
    .toHtml(styles);
```
