/**
 * @name util.js
 * @description 提供基础、通用的工具库
 * @author 法克@163.com
 * @date 2016-4-26
 * @version 1.0.0
 */

'use strict';

const slice = Array.prototype.slice;
const toString = Object.prototype.toString;
const eventSplitter = /\s+/;

/**
 * 遍历数组或者纯对象
 *
 * @param {Function} callback 回调函数
 * @param {Boolean} sign 标记是否支持回调函数返回中断 [可选]
 *   说明：0 => 不支持; 1 => 支持;
 *         default => 0;
 * @return {Function}
 */
const each = (callback, sign = 0) => {
    return array => {
        let checkArray = isArray(array);
        let solid = checkArray ? array : Object.keys(array), key, value;

        for (let i = 0, length = solid.length; i < length; i++) {
            key = checkArray ? i : solid[i];
            value = solid[key];

            if (sign) if (callback(value, key, array) === false) return;
            else callback(value, key, array);
        }
    };
};

export { each };

/**
 * 扩展
 *
 * @param {Object} target 源对象
 * @return {Boolean}
 */
const extend = (target, ...copys) => {
    let iteratee = each(object => {
        for (let key in object) target[key] = object[key];
    });
};

export { extend };

/**
 * 上下文代理
 *
 * @param {Object} context 上下文
 * @param {Function} callback 回调函数
 * @return {Function}
 */
const proxy = (context, callback, ...args) =>
    (...params) =>
        callback.apply(context, args.concat(params));

export { proxy };

/**
 * 获取类型
 *
 * @param {Type} type 值
 * @return {Boolean}
 */
const getType = type =>
    toString.call(type).slice(8, -1).toLowerCase();

export { getType };

/**
 * 是否是数组
 *
 * @param {Array} array 数组
 * @return {Boolean}
 */
const isArray = array =>
    getType(array) === 'array';

export { isArray };

/**
 * 是否是纯对象
 *
 * @param {Object} object 纯对象
 * @return {Boolean}
 */
const isPlainObject = object =>
    typeof object === 'object' && !isArray(object) && object != window && !object.nodeType;

export { isPlainObject };

/**
 * 是否是字符串
 *
 * @param {String} string 字符串
 * @return {Boolean}
 */
const isString = string =>
    getType(string) === 'string';

export { isString };

/**
 * 是否为空
 *
 * @param {Type} type 值
 * @return {Boolean}
 */
const isNothing = type =>
    type === void 0 || type === null;

export { isNothing };