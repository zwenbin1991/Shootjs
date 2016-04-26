/**
 * @name event.js
 * @description 事件管理器
 * @author 法克@163.com
 * @date 2016-4-26
 * @version 1.0.0
 */

'use strict';

import * as util from './util.js';

let eventSplitter = /\s+/;

/**
 * 绑定事件和事件处理程序
 *
 * @param {String} eventName 事件名
 * @param {Function} handle 事件处理程序
 * @param {Object} context 上下文
 */
const addEventListener = (eventName, handle, context) => {
    if (!eventName) return this;

    // 支持以空格分隔的事件名
    let eventNames = eventName.split(eventSplitter);
    let iteratee = util.each(evtName => {
        events = this._events || (this._events = {});
        (events[evtName] || (events[evtName] = [])).push({
            'evtName': evtName,
            'handle': handle,
            'ctx': context || window
        })
    }), events;

    iteratee(eventNames);

    return this;
};

export { addEventListener };

const removeEventListener = (eventName, handle) => {

};

export { removeEventListener };



