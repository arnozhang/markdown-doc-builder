/**
 * @author arnozhang <zyfgood12@163.com>
 * @date 2020/08/24
 */

import { JsUtils } from "js-utils-lite";
import { HtmlStyles } from "..";
import { HeaderIndicator } from "../impl/HeaderIndicator";
import { MarkdownTableBuilder } from "./MarkdownTableBuilder";
import { MarkdownListBuilder, MarkdownListItems } from "./MarkdownListBuilder";


export enum MarkdownNodeType {

    Unknown = 0,

    /**
     * # h1
     * ## h2
     * ...
     */
    Header = 1,

    /**
     * 正文
     */
    Text = 2,

    /**
     * -a
     * - b
     */
    List = 3,

    /**
     * ```javascript
     *   code
     * ``
     */
    CodeBlock = 4,

    /**
     * `hello`
     */
    Code = 5,

    /**
     * **bold**
     */
    Bold = 6,

    /**
     * *italic*
     */
    Italic = 7,

    /**
     * ***bold-italic***
     */
    BoldItalic = 8,

    /**
     * ~~strike-through~~
     */
    Strikethrough = 9,

    /**
     * > hello
     */
    BlockQuote = 10,

    /**
     * <br>
     */
    LineBreak = 11,

    /**
     * \n
     */
    NewLine = 12,

    /**
     * ---
     */
    Separator = 13,

    /**
     * ![img-name](url)
     */
    Image = 14,

    /**
     * [link-desc](url)
     */
    Link = 15,

    /**
     * | a | b | c |
     * |---|---|---|
     * | x | y | z |
     */
    Table = 16,

    /**
     * composite nodes
     */
    CompositeNodes = 17,
}


export enum MarkdownCodeType {

    Any = '',
    C = 'c',
    CPlusPlus = 'cplusplus',
    Json = 'json',
    Java = 'java',
    JavaScript = 'javascript',
    TypeScript = 'TypeScript',
    Objective_C = 'objective-c',
}


export interface MarkdownContentBuilder {

    toMarkdown(): string;

    toHtml(styles?: HtmlStyles): string;
}


export abstract class MarkdownBaseNode implements MarkdownContentBuilder {

    type: MarkdownNodeType;

    protected constructor(type: MarkdownNodeType) {
        this.type = type;
    }
}

/**
 * for resolve ts-warning
 */
export interface MarkdownBaseNode extends MarkdownContentBuilder {
}


export type MarkdownContent = MarkdownBaseNode | string;

export class MarkdownBaseContentNode extends MarkdownBaseNode {

    content: MarkdownContent;

    protected constructor(type: MarkdownNodeType, content: MarkdownContent) {
        super(type);
        this.content = content;
    }

    protected get markdownDocContent() {
        return this.getDocContent(false);
    }

    protected get htmlDocContent() {
        return this.getDocContent(true);
    }

    protected getDocContent(html?: boolean): string {
        if (this.content instanceof MarkdownBaseNode) {
            return html ? this.content.toHtml() : this.content.toMarkdown();
        }

        return this.content;
    }
}


export class MarkdownHeader extends MarkdownBaseContentNode {

    level: number;
    indicator: HeaderIndicator;

    constructor(
        level: number,
        content: MarkdownContent,
        indicator: HeaderIndicator) {

        super(MarkdownNodeType.Header, content);

        this.level = Math.min(level, 6);
        this.indicator = indicator;
    }

    toMarkdown(): string {
        let prefix = '';
        for (let i = 0; i < this.level; ++i) {
            prefix += '#';
        }

        const index = this.getIndex();
        return `${prefix} ${index}${this.markdownDocContent}\n`;
    }

    toHtml(): string {
        const tag = `h${this.level}`;
        const index = this.getIndex();

        return `<${tag}>${index}${this.htmlDocContent}</${tag}>\n`;
    }

    private getIndex(): string {
        if (this.indicator == null) {
            return '';
        }

        const level = this.level;
        const headerIndex = this.indicator.headerIndex;

        let markdownContent = '';

        if (level > this.indicator.prevHeaderLevel) {
            ++headerIndex[level];
        } else if (level < this.indicator.prevHeaderLevel) {
            for (let i = level; i < headerIndex.length; ++i) {
                headerIndex[i] = 1;
            }

            ++headerIndex[level - 1];
        } else {
            ++headerIndex[level - 1];
        }

        this.indicator.prevHeaderLevel = level;

        let index = '';

        for (let i = 0; i < level; ++i) {
            index += `${headerIndex[i]}.`;
        }

        return `${index} `;
    }
}

export class MarkdownText extends MarkdownBaseContentNode {

    constructor(content: MarkdownContent) {
        super(MarkdownNodeType.Text, content);
    }

    toMarkdown(): string {
        return `${this.markdownDocContent}`;
    }

    toHtml(): string {
        return `<span>${this.htmlDocContent}</span>\n`;
    }
}


export class MarkdownList extends MarkdownBaseNode {

    list: MarkdownListBuilder;

    constructor(items: MarkdownListItems | MarkdownListBuilder) {
        super(MarkdownNodeType.List);

        if (items instanceof MarkdownListBuilder) {
            this.list = items;
        } else {
            this.list = MarkdownListBuilder.newBuilder(items);
        }
    }

    toMarkdown(): string {
        return this.list.toMarkdown();
    }

    toHtml(): string {
        return this.list.toHtml();
    }
}

export class MarkdownCode extends MarkdownBaseContentNode {

    constructor(content: MarkdownContent) {
        super(MarkdownNodeType.Code, content);
    }

    toMarkdown(): string {
        return `<code>${this.markdownDocContent}</code>`;
    }

    toHtml(): string {
        return `<code>${this.htmlDocContent}</code>`;
    }
}

export class MarkdownCodeBlock extends MarkdownBaseContentNode {

    codeType: MarkdownCodeType;

    constructor(codeType: MarkdownCodeType, code: MarkdownContent) {
        super(MarkdownNodeType.CodeBlock, code);
        this.codeType = codeType;
    }

    toMarkdown(): string {
        return '\n```' + this.codeType + '\n' + this.markdownDocContent + '\n```\n';
    }

    toHtml(): string {
        return `\n<code>\n${this.htmlDocContent}\n</code>\n`;
    }
}

export class MarkdownBold extends MarkdownBaseContentNode {

    constructor(content: MarkdownContent) {
        super(MarkdownNodeType.Bold, content);
    }

    toMarkdown(): string {
        return `**${this.markdownDocContent}**`;
    }

    toHtml(): string {
        return `<strong>${this.htmlDocContent}</strong>`;
    }
}

export class MarkdownItalic extends MarkdownBaseContentNode {

    constructor(content: MarkdownContent) {
        super(MarkdownNodeType.Italic, content);
    }

    toMarkdown(): string {
        return `*${this.markdownDocContent}*`;
    }

    toHtml(): string {
        return `<em>${this.htmlDocContent}</em>`;
    }
}

export class MarkdownBoldItalic extends MarkdownBaseContentNode {

    constructor(content: MarkdownContent) {
        super(MarkdownNodeType.BoldItalic, content);
    }

    toMarkdown(): string {
        return `***${this.markdownDocContent}***`;
    }

    toHtml(): string {
        return `<strong><em>${this.htmlDocContent}</em></strong>`;
    }
}

export class MarkdownStrikethrough extends MarkdownBaseContentNode {

    constructor(content: MarkdownContent) {
        super(MarkdownNodeType.Strikethrough, content);
    }

    toMarkdown(): string {
        return `~~${this.markdownDocContent}~~`;
    }

    toHtml(): string {
        return `<s>${this.htmlDocContent}</s>`;
    }
}

export class MarkdownBlockQuote extends MarkdownBaseContentNode {

    constructor(content: MarkdownContent) {
        super(MarkdownNodeType.BlockQuote, content);
    }

    toMarkdown(): string {
        const content = this.markdownDocContent.replace('\n', '\\n')
        return `> ${content}\n\n`;
    }

    toHtml(): string {
        return `\n<blockquote>${this.htmlDocContent}</blockquote>\n`;
    }
}

export class MarkdownLineBreak extends MarkdownBaseNode {

    count: number;

    constructor(count?: number) {
        super(MarkdownNodeType.LineBreak);
        this.count = count > 0 ? count : 1;
    }

    toMarkdown(): string {
        return this.toHtml();
    }

    toHtml(): string {
        let content = '';
        for (let i = 0; i < this.count; ++i) {
            content += '<br>\n';
        }

        return content;
    }
}

export class MarkdownNewLine extends MarkdownBaseNode {

    constructor() {
        super(MarkdownNodeType.NewLine);
    }

    toMarkdown(): string {
        return '\n';
    }

    toHtml(): string {
        return '\n';
    }
}

export class MarkdownSeparator extends MarkdownBaseNode {

    constructor() {
        super(MarkdownNodeType.Separator);
    }

    toMarkdown(): string {
        return '---\n';
    }

    toHtml(): string {
        return '<hr />\n';
    }
}

export class MarkdownImage extends MarkdownBaseNode {

    imageUrl: string;
    description: string;

    constructor(imageUrl: string, description?: string) {
        super(MarkdownNodeType.Image);
        this.imageUrl = imageUrl;
        this.description = description;
    }

    private get imgDescription() {
        let description = this.description;
        if (JsUtils.isEmpty(description)) {
            description = this.imageUrl;
        }

        return description;
    }

    toMarkdown(): string {
        return `![${this.imgDescription}](${this.imageUrl})\n`;
    }

    toHtml(): string {
        return `<img src="${this.imageUrl}" alt="${this.imgDescription}"/>\n`;
    }
}

export class MarkdownLink extends MarkdownBaseNode {

    url: string;
    title: string;

    constructor(url: string, title?: string) {
        super(MarkdownNodeType.Link);

        this.url = url;
        this.title = title;
    }

    private get urlTitle() {
        let title = this.title;
        if (JsUtils.isEmpty(title)) {
            title = this.url;
        }

        return title;
    }

    toMarkdown(): string {
        return `[${this.urlTitle}](${this.url})`;
    }

    toHtml(): string {
        return `<a href="${this.url}" target="_blank">${this.urlTitle}</a>`;
    }
}

export class MarkdownTable extends MarkdownBaseNode {

    table: MarkdownTableBuilder;

    constructor(table: MarkdownTableBuilder) {
        super(MarkdownNodeType.Table);
        this.table = table;
    }

    toMarkdown(): string {
        return `\n${this.table.toMarkdown()}\n`;
    }

    toHtml(): string {
        return `\n${this.table.toHtml()}\n`;
    }
}

export class MarkdownCompositeNodes extends MarkdownBaseNode {

    private readonly nodes: MarkdownBaseNode[] = [];

    constructor(...nodes: MarkdownBaseNode[]) {
        super(MarkdownNodeType.CompositeNodes);

        if (JsUtils.isNotEmpty(nodes)) {
            this.nodes = nodes;
        }
    }

    append(node: MarkdownBaseNode): MarkdownCompositeNodes {
        this.nodes.push(node);
        return this;
    }

    toMarkdown(): string {
        let content = '';
        for (let node of this.nodes) {
            content += node.toMarkdown();
        }

        return content;
    }

    toHtml(): string {
        let content = '';
        for (let node of this.nodes) {
            content += node.toHtml();
        }

        return content;
    }
}
