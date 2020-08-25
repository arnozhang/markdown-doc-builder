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
        this.globalCssContent = null;

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
