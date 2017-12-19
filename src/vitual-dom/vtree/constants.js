/**
 * 我们做同级元素比较时，可能会出现四种情况
 * 整个元素都不一样，即元素被replace掉
 * 元素的attrs不一样
 * 元素的text文本不一样
 * 元素顺序被替换，即元素需要reorder
 * 所以这里定义四种变量
 */
export const REPLACE = 0  // replace => 0
export const ATTRS   = 1  // attrs   => 1
export const TEXT    = 2  // text    => 2
export const REORDER = 3  // reorder => 3