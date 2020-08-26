import { JsUtils } from "js-utils-lite";
import { HtmlStyles } from "..";
import { MarkdownBaseNode, MarkdownContentBuilder } from "./MarkdownDeclares";

/**
 * @author arnozhang <zyfgood12@163.com>
 * @date 2020/08/20
 */

export enum TableAlignType {

    Left = 0,
    Middle = 1,
    Right = 2,
}


export class MarkdownTableBuilder implements MarkdownContentBuilder {

    static newBuilder(row: number, col: number): MarkdownTableBuilder {
        return new MarkdownTableBuilder(row, col);
    }

    private headers: any[];
    private headersAlign: TableAlignType[];
    private readonly body: any[][];


    /**
     * @private
     */
    private constructor(row: number, col: number) {
        this.headers = new Array(col);

        this.body = new Array(row);
        for (let i = 0; i < row; ++i) {
            this.body[i] = new Array(col);
        }
    }

    /**
     * 设置表头对齐格式
     *
     * @param aligns [':---:', '---:', ':---', ]
     */
    setHeadersAlign(aligns: TableAlignType[]): MarkdownTableBuilder {
        this.headersAlign = aligns;
        return this;
    }

    header(headers: any[]): MarkdownTableBuilder {
        this.headers = headers;
        return this;
    }

    appendRow(row: any[]): MarkdownTableBuilder {
        this.body.push(row);
        return this;
    }

    setValue(row: number, col: number, content: any): MarkdownTableBuilder {
        this.body[row][col] = content || '';
        return this;
    }


    toMarkdown(): string {
        let table = '';

        const appendRow = (tableRow: any[]) => {
            let line = '|';

            for (let i = 0; i < tableRow.length; ++i) {
                let value = tableRow[i];
                if (value == null) {
                    value = '';
                } else if (value instanceof MarkdownBaseNode) {
                    value = value.toMarkdown();
                } else {
                    value = value.replace('\n', '\\n');
                }

                line += ` ${value} |`;
            }

            table += `${line}\n`;
        };

        appendRow(this.headers);

        let alignIndicators = new Array(this.headers.length).fill(':---');
        if (JsUtils.isNotEmpty(this.headersAlign)) {
            for (let i = 0; i < this.headersAlign.length; ++i) {
                let align = ':---';
                let alignType = this.headersAlign[i];
                if (alignType === TableAlignType.Right) {
                    align = '---:';
                } else if (alignType === TableAlignType.Middle) {
                    align = ':---:';
                }

                alignIndicators[i] = align;
            }
        }

        appendRow(alignIndicators);

        for (let i = 0; i < this.body.length; ++i) {
            appendRow(this.body[i]);
        }

        return table;
    }

    toHtml(styles?: HtmlStyles): string {
        const appendRow = (tableRow: any[], isHeader: boolean) => {
            let content = '';

            for (let i = 0; i < tableRow.length; ++i) {
                let item = tableRow[i];
                if (item == null) {
                    item = '';
                } else if (item instanceof MarkdownBaseNode) {
                    item = item.toHtml();
                }

                let align = this.headersAlign ? this.headersAlign[i] : null;
                let styleContent = 'text-align: inherit;';
                if (align === TableAlignType.Middle) {
                    styleContent = 'text-align: center;';
                } else if (align === TableAlignType.Left) {
                    styleContent = 'text-align: left;';
                } else if (align === TableAlignType.Right) {
                    styleContent = 'text-align: right;';
                }

                if (isHeader) {
                    if (styles && JsUtils.isNotEmpty(styles.thStyleContent)) {
                        styleContent = `${styles.thStyleContent} ${styleContent}`;
                    }

                    content += `    <th style="${styleContent}"><strong>${item}</strong></th>\n`;
                } else {
                    if (styles && JsUtils.isNotEmpty(styles.tdStyleContent)) {
                        styleContent = `${styles.tdStyleContent} ${styleContent}`;
                    }

                    content += `    <td style="${styleContent}">${item}</td>\n`;
                }
            }

            return `\n  <tr>\n${content}  </tr>\n`;
        };

        let tableContent = '';

        tableContent += appendRow(this.headers, true);
        for (let i = 0; i < this.body.length; ++i) {
            tableContent += appendRow(this.body[i], false);
        }

        const tableStyle = styles && JsUtils.isNotEmpty(styles.tableStyleContent)
            ? ` style="${styles.tableStyleContent}"` : '';

        return `<table${tableStyle}>
${tableContent}
</table>`;
    }
}

