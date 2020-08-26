import { JsUtils } from "js-utils-lite";
import { MarkdownBaseNode, MarkdownContentBuilder } from "./MarkdownDeclares";
import { HtmlStyles } from "..";

/**
 * @author @author arnozhang <zyfgood12@163.com>
 * @date 2020/08/25
 */

export type MarkdownListItems = string[] | any[] | MarkdownBaseNode[];


export class MarkdownListBuilder implements MarkdownContentBuilder {

    static newBuilder(items?: MarkdownListItems, ordered?: boolean): MarkdownListBuilder {
        return new MarkdownListBuilder(items, ordered);
    }


    private readonly items: MarkdownListItems;

    private listOrdered: boolean = false;


    /**
     * @private
     */
    private constructor(items?: MarkdownListItems, ordered?: boolean) {
        this.items = items || [];
        this.listOrdered = ordered;
    }

    append(...items: string | any | MarkdownBaseNode | MarkdownListBuilder): MarkdownListBuilder {
        if (JsUtils.isNotEmpty(items)) {
            for (let item of items) {
                this.items.push(item);
            }
        }

        return this;
    }

    ordered(): MarkdownListBuilder {
        this.listOrdered = true;
        return this;
    }

    unordered(): MarkdownListBuilder {
        this.listOrdered = false;
        return this;
    }

    toMarkdown(): string {
        const content = this.listInternal(this.items, 0, true);
        return `\n${content}\n`;
    }

    toHtml(styles?: HtmlStyles): string {
        const content = this.listInternal(this.items, 0, false);
        return this.htmlList(0, content);
    }

    private static dupString(char: string, times: number): string {
        let result = '';
        for (let i = 0; i < times; ++i) {
            result += char;
        }

        return result;
    }

    private htmlList(nest: number, content: string) {
        const olTypes = [ '1', 'a', 'i', ];
        const prefix = MarkdownListBuilder.dupString('  ', nest);

        return this.listOrdered
            ? `\n${prefix}<ol type="${olTypes[nest % olTypes.length]}">\n${content}${prefix}</ol>\n`
            : `\n${prefix}<ul>\n${content}${prefix}</ul>\n`;
    }

    private listInternal(
        items: MarkdownListItems, nest: number, toMarkdown: boolean) {

        let content = '';

        for (let i = 0; i < items.length; ++i) {
            const item = items[i];

            if (JsUtils.isArray(item)) {
                content += this.listInternal(item, nest + 1, toMarkdown);
            } else if (item instanceof MarkdownBaseNode) {
                const itemContent = toMarkdown ? item.toMarkdown() : item.toHtml();
                content += this.buildListItem(nest, i, itemContent, toMarkdown);
            } else if (item instanceof MarkdownListBuilder) {
                const builder = item as MarkdownListBuilder;
                const subListNest = nest + 1;
                const subListContent = this.listInternal(
                    builder.items, subListNest, toMarkdown);

                content += toMarkdown
                    ? subListContent
                    : this.htmlList(subListNest, subListContent);
            } else {
                content += this.buildListItem(nest, i, item, toMarkdown);
            }
        }

        return content;
    }

    private buildListItem(
        nest: number, index: number,
        content: string, toMarkdown: boolean): string {

        let prefix = toMarkdown
            ? MarkdownListBuilder.dupString('\t', nest)
            : MarkdownListBuilder.dupString('  ', nest + 1);

        if (toMarkdown) {
            return this.listOrdered
                ? `${prefix}${index + 1}. ${content}\n`
                : `${prefix}- ${content}\n`;
        } else {
            // HTML
            return `${prefix}<li>${content}</li>\n`;
        }
    };
}
