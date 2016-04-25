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
    var eventSplitter = /\s+/;

    /**
     * 遍历数组或者纯对象
     *
     * @param {Function} callback 回调函数
     * @param {Boolean} sign 标记是否支持回调函数返回中断 [可选]
     *   说明：0 => 不支持; 1 => 支持;
     *         default => 0;
     * @return {Function}
     */
    var each = function (callback, sign) {
        sign != void 0 || (sign = 0);

        return function (array) {
            var checkArray = isArray(array);
            var solid = checkArray ? array : Object.keys(array), key, value;

            for (var i = 0, length = solid.length; i < length; i++) {
                key = checkArray ? i : solid[i];
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
     * @param {Object} target 源对象
     * @return {Boolean}
     */
    var extend = function (target) {
        var copys = slice.call(arguments, 1);
        var iteratee = each(function (value) {
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
     * @param {Array} array 数组
     * @return {Boolean}
     */
    var isArray = function (array) {
        return toString.call(array).slice(8, -1).toLowerCase() === 'array';
    };

    /**
     * 是否是纯对象
     *
     * @param {Object} object 纯对象
     * @return {Boolean}
     */
    var isPlainObject = function (object) {
        return typeof object === 'object' && !isArray(object) && object != root && !object.nodeType;
    };

    var module = (function () {
        return {
            /**
             * 函数上下文代理
             *
             * @param {Object} context 上下文
             * @param {Function} callback 函数
             */
            proxy: function (context, callback) {
                var args = slice.call(arguments, 2);

                return function () {
                    return callback.apply(context, args.concat(slice.call(arguments)));
                };
            },

            /**
             * 派生子类
             *
             * @param {Object} protoProps 子类原型属性
             * @return {Function}
             */
            fork: function (protoProps) {
                var parent = this;
                var child = function () {
                    return parent.apply(this, arguments);
                };

                // 创建临时类
                var tempClass = function () {};
                tempClass.prototype = parent.prototype;

                // 继承
                child.prototype = new tempClass;
                child.prototype.constructor = child;

                // 通过protoProps扩展原型方法
                extend(child.prototype, protoProps);

                child.__super__ = parent.prototype;

                return child;
            }
        };
    })();

    var Event = Shootjs.Event = {
        on: function (eventName, callback, context) {
            var eventNames = eventSplitter.test(eventName) ? eventName.split(eventSplitter) : [eventName];
            var iteratee = each(function (evtName) {

            });

        }
    };



    return Shootjs;
});