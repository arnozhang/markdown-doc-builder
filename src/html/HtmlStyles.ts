/**
 * @author arnozhang <zyfgood12@163.com>
 * @date 2020/08/25
 */

export class HtmlStyles {

    static newStyles(): HtmlStyles {
        return new HtmlStyles();
    }

    static defaultStyles(): HtmlStyles {
        return HtmlStyles.newStyles().useDefault();
    }


    globalCssContent: string;

    tableStyleContent: string;
    thStyleContent: string;
    tdStyleContent: string;


    /**
     * @private
     */
    private constructor() {
    }

    useDefault(): HtmlStyles {
        // global CSS
        this.globalCssContent = `
blockquote {
    margin-top: 5px;
    margin-bottom: 5px;
    padding-left: 1em;
    margin-left: 0px;
    border-left: 3px solid #eee;
    color: #8C8C8C;
}

code {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;
    font-size: inherit;
    background-color: rgba(0, 0, 0, 0.06);
    padding: 0 2px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 2px 2px;
    line-height: inherit;
    word-wrap: break-word;
    text-indent: 0;
}
`;

        // table
        this.tableStyleContent = 'border: 1px solid #000;';
        this.thStyleContent = 'vertical-align: middle; background-color: #d9edfa;';
        this.tdStyleContent = 'vertical-align: middle;';

        return this;
    }

    globalCss(css: string): HtmlStyles {
        this.globalCssContent = css;
        return this;
    }

    thStyle(style: string): HtmlStyles {
        this.thStyleContent = style;
        return this;
    }

    tdStyle(style: string): HtmlStyles {
        this.tdStyleContent = style;
        return this;
    }

    tableStyle(style: string): HtmlStyles {
        this.tableStyleContent = style;
        return this;
    }
}
