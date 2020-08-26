import { HtmlStyles } from "..";
import { HeaderIndicator } from "../impl/HeaderIndicator";
import {
    MarkdownBaseNode,
    MarkdownCodeType,
    MarkdownContent,
    MarkdownContentBuilder,
    MarkdownHeader
} from "./MarkdownDeclares";
import { MarkdownTableBuilder } from "./MarkdownTableBuilder";
import { MarkdownListBuilder, MarkdownListItems } from "./MarkdownListBuilder";
import { markdown } from "./Markdown";


/**
 * @author @author arnozhang <zyfgood12@163.com>
 * @date 2020/08/20
 */

export class MarkdownBuilder implements MarkdownContentBuilder {

    static newBuilder(): MarkdownBuilder {
        return new MarkdownBuilder();
    }

    private title: string;
    private isHeaderOrdered: boolean = true;
    private headerIndicator = new HeaderIndicator();

    private readonly nodes: MarkdownBaseNode[] = [];


    private constructor() {
    }

    docTitle(title: string): MarkdownBuilder {
        this.title = title;
        return this;
    }

    headerOrdered(ordered: boolean): MarkdownBuilder {
        this.headerIndicator = ordered ? new HeaderIndicator() : null;
        return this;
    }

    h1(content: string): MarkdownBuilder {
        return this.h(1, content);
    }

    h2(content: string): MarkdownBuilder {
        return this.h(2, content);
    }

    h3(content: string): MarkdownBuilder {
        return this.h(3, content);
    }

    h4(content: string): MarkdownBuilder {
        return this.h(4, content);
    }

    h5(content: string): MarkdownBuilder {
        return this.h(5, content);
    }

    h6(content: string): MarkdownBuilder {
        return this.h(6, content);
    }

    h(level: number, content: string): MarkdownBuilder {
        return this.appendNode(new MarkdownHeader(
            level, content, this.headerIndicator));
    }

    resetHeaderIndicator(): MarkdownBuilder {
        if (this.headerIndicator) {
            this.headerIndicator.resetIndicator();
        }

        return this;
    }

    bold(content: MarkdownContent): MarkdownBuilder {
        return this.appendNode(markdown.bold(content));
    }

    italic(content: MarkdownContent): MarkdownBuilder {
        return this.appendNode(markdown.italic(content));
    }

    boldItalic(content: MarkdownContent): MarkdownBuilder {
        return this.appendNode(markdown.boldItalic(content));
    }

    strikethrough(content: MarkdownContent): MarkdownBuilder {
        return this.appendNode(markdown.strikethrough(content));
    }

    text(content: MarkdownContent): MarkdownBuilder {
        return this.appendNode(markdown.text(content));
    }

    blockQuote(content: MarkdownContent): MarkdownBuilder {
        return this.appendNode(markdown.blockQuote(content));
    }

    code(content: string): MarkdownBuilder {
        return this.appendNode(markdown.code(content));
    }

    codeBlock(codeType: MarkdownCodeType, content: string): MarkdownBuilder {
        return this.appendNode(markdown.codeBlock(codeType, content));
    }

    linebreak(count?: number): MarkdownBuilder {
        return this.appendNode(markdown.linebreak(count));
    }

    newline(): MarkdownBuilder {
        return this.appendNode(markdown.newline());
    }

    separator(): MarkdownBuilder {
        return this.appendNode(markdown.separator());
    }

    image(url: string, description?: string): MarkdownBuilder {
        return this.appendNode(markdown.image(url, description));
    }

    link(url: string, title?: string): MarkdownBuilder {
        return this.appendNode(markdown.link(url, title));
    }

    table(table: MarkdownTableBuilder): MarkdownBuilder {
        return this.appendNode(markdown.table(table));
    }

    list(items: MarkdownListItems | MarkdownListBuilder, ordered?: boolean): MarkdownBuilder {
        return this.appendNode(markdown.list(items, ordered));
    }

    compositeNodes(...nodes: MarkdownBaseNode[]): MarkdownBuilder {
        return this.appendNode(markdown.compositeNodes(...nodes));
    }

    appendNode(node: MarkdownBaseNode): MarkdownBuilder {
        if (node) {
            this.nodes.push(node);
        }

        return this;
    }

    toMarkdown(): string {
        let markdownContent = '';
        for (let item of this.nodes) {
            markdownContent += item.toMarkdown();
        }

        return markdownContent;
    }

    toHtml(styles?: HtmlStyles): string {
        let htmlContent = '';
        for (let item of this.nodes) {
            htmlContent += item.toHtml(styles);
        }

        return `<html>
<header>
  <title>${this.title || ''}</title>

  <style type="text/css">
    ${styles && styles.globalCssContent ? styles.globalCssContent : ''}
  </style>
</header>

<body>
${htmlContent}
</body>
</html>`;
    }
}
