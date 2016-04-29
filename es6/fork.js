/**
 * @name fork.js
 * @description 派生
 * @author 法克@163.com
 * @date 2016-4-26
 * @version 1.0.0
 */

'use strict';

import * as util from './util.js';

/**
 * 派生类
 *
 * @param {Object} protoProps 原型方法对象
 * @return {Function}
 */
export const fork = protoProps => {
    let parent = this;
    let child = function (...args) {
        parent.apply(this, args);
    };
    // 创建临时类，child的prototype指向临时类的实例
    let tempClass = () => {};
    tempClass.prototype = parent.prototype;

    // 继承
    child.prototype = new tempClass;
    child.prototype.constructor = child;

    // 扩展child原型方法
    util.extend(child.prototype, protoProps);
    // 扩展child静态方法
    util.extend(child, parent);

    // 指定__super__为父类prototype
    child.__super__ = parent.prototype;

    return child;
};