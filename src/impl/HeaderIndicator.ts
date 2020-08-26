/**
 * @author arnozhang <zyfgood12@163.com>
 * @date 2020/08/25
 */

export class HeaderIndicator {

    static readonly maxHeaderLevel = 6;

    private prevHeaderLevel = 0;
    private headerIndex: number[] = null;


    constructor() {
        this.resetIndicator();
    }

    resetIndicator() {
        this.prevHeaderLevel = 0;
        this.headerIndex = new Array(HeaderIndicator.maxHeaderLevel).fill(0);
    }

    getHeaderIndex(level: number) {
        const headerIndex = this.headerIndex;

        if (level > this.prevHeaderLevel) {
            ++headerIndex[level - 1];
        } else if (level < this.prevHeaderLevel) {
            for (let i = level; i < headerIndex.length; ++i) {
                headerIndex[i] = 1;
            }

            ++headerIndex[level - 1];
        } else {
            ++headerIndex[level - 1];
        }

        this.prevHeaderLevel = level;

        let index = '';
        for (let i = 0; i < level; ++i) {
            index += `${headerIndex[i]}.`;
        }

        return `${index} `;
    }
}
