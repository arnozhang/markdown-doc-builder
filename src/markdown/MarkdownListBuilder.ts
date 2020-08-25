import { JsUtils } from "js-utils-lite";
import { MarkdownBaseNode, MarkdownContentBuilder } from "./MarkdownDeclares";
import { HtmlStyles } from "..";

/**
 * @author @author arnozhang <zyfgood12@163.com>
 * @date 2020/08/25
 */

export type MarkdownListItems = string[] | any[] | MarkdownBaseNode[];


export class MarkdownListBuilder implements MarkdownContentBuilder {

    static newBuilder(items?: MarkdownListItems): MarkdownListBuilder {
        return new MarkdownListBuilder(items);
    }


    private readonly items: MarkdownListItems;


    /**
     * @private
     */
    private constructor(items?: MarkdownListItems) {
        this.items = items || [];
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
        return this;
    }

    unordered(): MarkdownListBuilder {
        return this;
    }

    toMarkdown(): string {
        const content = this.listInternal(
            '', this.items, 0, true,
            (nestPrefix: string, item: string) => {
                return `${nestPrefix}- ${item}\n`;
            });

        return `\n${content}\n`;
    }

    toHtml(styles?: HtmlStyles): string {
        const content = this.listInternal(
            '', this.items, 1, false,
            (nestPrefix: string, item: string) => {
                return `${nestPrefix}<li>${item}</li>\n`;
            });

        return `\n<ul>\n${content}\n</ul>\n`;
    }

    private listInternal(
        content: string,
        items: MarkdownListItems,
        nest: number,
        toMarkdown: boolean,
        formatter: (nestPrefix: string, item: string) => string) {

        const nestPrefix = (nest: number) => {
            if (nest == null) {
                nest = 0;
            }

            let prefix = '';
            for (let i = 0; i < nest; ++i) {
                prefix += '  ';
            }

            return prefix;
        };

        const rawItem = (item: any) => {
            content += formatter(nestPrefix(nest), item);
        };

        for (let item of items) {
            if (JsUtils.isArray(item)) {
                content = this.listInternal(
                    content, item, nest + 1, toMarkdown, formatter);
            } else if (item instanceof MarkdownBaseNode) {
                rawItem(toMarkdown ? item.toMarkdown() : item.toHtml());
            } else if (item instanceof MarkdownListBuilder) {
                const builder = item as MarkdownListBuilder;
                content = this.listInternal(
                    content, builder.items, nest + 1, toMarkdown, formatter);
            } else {
                rawItem(item);
            }
        }

        return content;
    }
}
