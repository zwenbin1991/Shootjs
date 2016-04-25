/**
 * @name Shootjs.js
 * @description 简单、易用、轻量的javascript mvc框架
 * @author 法克@163.com
 * @date 2016-4-25
 * @version 1.0.0
 */

'use strict';

;(function (root, factory) {
    if (typeof define !== 'undefined' && define.amd) {
        define('Shootjs', function () {
            root.Shootjs = factory(root, {});
        });
    } else {
        root.Shootjs = factory(root, {});
    }

})(this, function (root, Shootjs) {
    var slice = Array.prototype.slice;
    var toString = Object.prototype.toString;

    /**
     * 遍历数组或者纯对象
     *
     * @static
     * @param {Boolean} sign 标记是否支持回调函数返回中断
     *   说明：0 => 不支持; 1 => 支持;
     *         default => 0;
     * @param {Function} callback 回调函数
     * @return {Function}
     */
    Shootjs._each = function (sign, callback) {
        sign != void 0 || (sign = 0);

        return function (array) {
            var isArray = Shootjs.isArray(array);
            var solid = isArray ? array : Object.keys(array), key, value;

            for (var i = 0, length = solid.length; i < length; i++) {
                key = isArray ? i : solid[i];
                value = solid[key];

                if (sign) {
                    if (callback(value, key, array) === false) return;
                } else {
                    callback(value, key, array);
                }
            }
        };
    };

    /**
     * 扩展
     *
     * @static
     * @param {Object} target 源对象
     * @return {Boolean}
     */
    Shootjs._extend = function (target) {
        var copys = slice.call(arguments, 1);
        var iteratee = Shootjs._each(function (value) {
            for (var key in value) {
                target[key] = value[key];
            }
        });

        if (!copys.length) {
            copys = [target];
            target = this;
        }

        iteratee(copys);
    };

    /**
     * 是否是数组
     *
     * @static
     * @param {Array} array 数组
     * @return {Boolean}
     */
    Shootjs.isArray = function (array) {
        return toString.call(array).slice(8, -1).toLowerCase() === 'array';
    };

    /**
     * 是否是纯对象
     *
     * @static
     * @param {Object} object 纯对象
     * @return {Boolean}
     */
    Shootjs.isPlainObject = function (object) {
        return typeof object === 'object' && !Shootjs.isArray(object) && object != root && !object.nodeType;
    };

    return Shootjs;
});