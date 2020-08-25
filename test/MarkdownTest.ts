/**
 * @author arnozhang <zyfgood12@163.com>
 * @date 2020/08/25
 */

import * as fs from "fs";
import markdown, { MarkdownCodeType, TableAlignType } from "../src";

const builder = markdown
    .newBuilder()
    .docTitle('markdown-doc-builder demo');

// headers
builder
    .h1('h1 Heading')
    .h2('h2 Heading')
    .h3('h3 Heading')
    .h4('h4 Heading')
    .h5('h5 Heading')
    .h6('h6 Heading')
    .newline();

builder.separator();

// Emphasis
builder.bold('This is bold text').linebreak();
builder.text(markdown.italic('This is italic text')).linebreak();
builder.boldItalic('This is bold-italic text').linebreak();
builder.strikethrough('This is strikethrough text').linebreak();

// Blockquotes
builder.blockQuote('Blockquotes demo').linebreak();
builder.blockQuote(markdown.compositeNodes(
    markdown.text('Blockquotes can also be nested…'),
    markdown.blockQuote('nested blockquotes')))
    .linebreak();

// code
builder.compositeNodes(
    markdown.text('Inline '),
    markdown.code('code'))
    .linebreak();

builder.codeBlock(MarkdownCodeType.Json, JSON.stringify({
    name: 'Arno Zhang',
    github: 'https://github.com/arnozhang',
}, null, 4));

builder.codeBlock(MarkdownCodeType.JavaScript, "var foo = function (bar) {\n" +
    "  return bar++;\n" +
    "};\n" +
    "\n" +
    "console.log(foo(5));");

// list
builder.list([ 'Java', 'JavaScript', 'TypeScript' ]);
builder.list([
    'Java', 'JavaScript', 'TypeScript',
    'Misc',
    markdown.newListBuilder().append('a', 'b', 'c'),
]);


// table
builder.table(markdown
    .newTableBuilder(0, 2)
    .header([ 'Option', 'Description' ])
    .appendRow([ 'data', 'path to data files to supply the data that will be passed into templates.' ])
    .appendRow([ 'engine', 'engine to be used for processing templates. Handlebars is the default.' ])
    .appendRow([ 'ext', 'extension to be used for dest files.' ]));

builder.table(markdown
    .newTableBuilder(1, 2)
    .header([ 'Option', 'Description' ])
    .setValue(0, 0, 'data')
    .setValue(0, 1, markdown.compositeNodes(
        markdown.text('path to data files to supply the data that '),
        markdown.boldItalic('will be passed into templates.'),
    ))
    .appendRow([ 'engine', 'engine to be used for processing templates. Handlebars is the default.' ])
    .appendRow([ 'ext', 'extension to be used for dest files.' ])
    .setHeadersAlign([ TableAlignType.Middle, TableAlignType.Right, ]));


// links
builder
    .link('https://github.com/arnozhang/markdown-doc-builder')
    .newline()
    .link('https://github.com/arnozhang/markdown-doc-builder', 'markdown-doc-builder')
    .newline();

// image
builder
    .image('https://octodex.github.com/images/minion.png', 'Minion')
    .newline()
    .image('https://octodex.github.com/images/stormtroopocat.jpg')
    .newline();

// write output
if (!fs.existsSync('./test/output')) {
    fs.mkdirSync('./test/output');
}

fs.writeFileSync('./test/output/demo.md', builder.toMarkdown());


const styles = markdown
    .defaultHtmlStyles()
    .globalCss("body {color: #000;}");

fs.writeFileSync('./test/output/demo.html', builder.toHtml(styles));
