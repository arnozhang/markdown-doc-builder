import { JsUtils } from "js-utils-lite";
import {
    MarkdownBaseNode,
    MarkdownBlockQuote,
    MarkdownBold,
    MarkdownBoldItalic,
    MarkdownCode,
    MarkdownCodeBlock,
    MarkdownCodeType,
    MarkdownCompositeNodes,
    MarkdownContent,
    MarkdownImage,
    MarkdownItalic,
    MarkdownLineBreak,
    MarkdownLink,
    MarkdownList,
    MarkdownNewLine,
    MarkdownSeparator,
    MarkdownStrikethrough,
    MarkdownTable,
    MarkdownText
} from "./MarkdownDeclares";
import { MarkdownTableBuilder } from "./MarkdownTableBuilder";
import { MarkdownListBuilder, MarkdownListItems } from "./MarkdownListBuilder";
import { MarkdownBuilder } from "./MarkdownBuilder";
import { HtmlStyles } from "..";

/**
 * @author arnozhang <zyfgood12@163.com>
 * @date 2020/08/25
 */

export namespace markdown {

    export function bold(content: MarkdownContent) {
        return new MarkdownBold(content);
    }

    export function italic(content: MarkdownContent) {
        return new MarkdownItalic(content);
    }

    export function boldItalic(content: MarkdownContent) {
        return new MarkdownBoldItalic(content);
    }

    export function strikethrough(content: MarkdownContent) {
        return new MarkdownStrikethrough(content);
    }

    export function text(content: MarkdownContent) {
        return new MarkdownText(content);
    }

    export function blockQuote(content: MarkdownContent) {
        return new MarkdownBlockQuote(content);
    }

    export function code(content: string) {
        return new MarkdownCode(content);
    }

    export function codeBlock(codeType: MarkdownCodeType, content: string) {
        return new MarkdownCodeBlock(codeType, content);
    }

    export function linebreak(count?: number) {
        return new MarkdownLineBreak(count);
    }

    export function newline() {
        return new MarkdownNewLine();
    }

    export function separator() {
        return new MarkdownSeparator();
    }

    export function image(url: string, description?: string) {
        return new MarkdownImage(url, description);
    }

    export function link(url: string, title?: string) {
        return new MarkdownLink(url, title);
    }

    export function table(table: MarkdownTableBuilder) {
        return new MarkdownTable(table);
    }

    export function list(
        items: MarkdownListItems | MarkdownListBuilder,
        ordered?: boolean) {

        return new MarkdownList(items, ordered);
    }

    export function compositeNodes(...nodes: MarkdownBaseNode[]) {
        if (JsUtils.isNotEmpty(nodes)) {
            return new MarkdownCompositeNodes(...nodes);
        }

        return null;
    }

    export function newBuilder() {
        return MarkdownBuilder.newBuilder();
    }

    export function newTableBuilder(row: number, col: number) {
        return MarkdownTableBuilder.newBuilder(row, col);
    }

    export function newListBuilder(items?: MarkdownListItems, ordered?: boolean) {
        return MarkdownListBuilder.newBuilder(items, ordered);
    }

    export function newHtmlStyles() {
        return HtmlStyles.newStyles();
    }

    export function defaultHtmlStyles() {
        return HtmlStyles.defaultStyles();
    }
}
