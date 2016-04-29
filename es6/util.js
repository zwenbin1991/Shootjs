// Shootjs.js
// author: 法克
// email: 法克@163.com
// MIT license

'use strict';

const slice = Array.prototype.slice;
const toString = Object.prototype.toString;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const keys = Object.keys;
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
export const each = (callback, sign = 0) => {
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

/**
 * 扩展
 *
 * @param {Object} target 源对象
 * @return {Boolean}
 */
export const extend = (target, ...copys) => {
    let iteratee = each(object => {
        for (let key in object) target[key] = object[key];
    });

    iteratee(copys);

    return target;
};

/**
 * 上下文代理
 *
 * @param {Object} context 上下文
 * @param {Function} callback 回调函数
 * @return {Function}
 */
export const proxy = (context, callback, ...args) =>
    (...params) =>
        callback.apply(context, args.concat(params));

/**
 * 生成唯一值
 */
export const unique = () => {
    let idCount = 0;

    return prefix =>
        prefix ? prefix + (++idCount) : ++idCount;
};

/**
 * 获取类型
 *
 * @param {Type} type 值
 * @return {Boolean}
 */
export const getType = type =>
    toString.call(type).slice(8, -1).toLowerCase();

/**
 * 是否是数组
 *
 * @param {Array} array 数组
 * @return {Boolean}
 */
export const isArray = array =>
    getType(array) === 'array';

/**
 * 是否是纯对象
 *
 * @param {Object} object 纯对象
 * @return {Boolean}
 */
export const isPlainObject = object =>
    typeof object === 'object' && !isArray(object) && object != window && !object.nodeType;

/**
 * 是否是字符串
 *
 * @param {String} string 字符串
 * @return {Boolean}
 */
export const isString = string =>
    getType(string) === 'string';

/**
 * 是否为空
 *
 * @param {Type} type 值
 * @return {Boolean}
 */
export const isNothing = type =>
    type === void 0 || type === null;

/**
 * 比较值是否相等
 */
export const isEqual = (a, b) => {
    // 简单类型比较
    // 注意 0、-0的比较
    if (a === b) return a !== 0 || 1 / a === 1 / b;

    var type = getType(a), iteratee;

    // 复杂类型比较
    if (type === 'regexp') return '' + a === '' + b;
    if (type === 'date') return  +a === +b;

    // 数组比较
    // 首先比较数组长度是否一致
    if (isArray(a) && isArray(b)) {
        if (a.length !== b.length) return false;

        iteratee = each((value, index) =>
            isEqual(value, b[index]), 1);

        return iteratee(a);
    }

    // 纯对象比较
    if (isPlainObject(a) && isPlainObject(b)) {
        if (keys(a).length !== keys(b).length) return false;

        iteratee = each((value, key) =>
            hasOwnProperty.call(b, key) && isEqual(value, b[key]), 1);

        return iteratee(a);
    }

    return false;
};