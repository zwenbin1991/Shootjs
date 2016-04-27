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
    let eventNames = eventName.split(eventSplitter), events;
    let iteratee = util.each(evtName => {
        events = this._events || (this._events = {});
        (events[evtName] || (events[evtName] = [])).push({
            'handle': handle,
            'ctx': context || window
        })
    });

    iteratee(eventNames);

    return this;
};

export { addEventListener };

/**
 * 删除事件和事件处理程序
 *
 * @param {String} eventName 事件名
 * @param {Function} handle 事件处理程序
 */
const removeEventListener = (eventName, handle) => {
    if (!this._events) return this;

    // 如果不存在一个参数，则清空所有事件
    if (!eventName) {
        this._events = {};
        return this;
    }

    // 处理单个事件，或者以空格分开的多个事件
    let eventNames = eventName.split(eventSplitter), events, handles;
    // 创建遍历函数
    let iteratee = util.each(evtName => {
        events = this._events[evtName];
        handles = [];

        // 如果没提供了需要删除的handle，则删除该事件所注册的所有handle
        // 删除提供的handle
        util.each(event => {
            (handle && event.handle !== handle) && handles.push(event);
        })(events);

        this._events[evtName] = handles;
    });

    iteratee(eventNames);

    return this;
};

export { removeEventListener };

const trigger = (eventName, ...args) => {
    if (!this._events || !eventName) return this;

    let eventNames = eventName.split(eventSplitter), events, handle, context;
    let iteratee = util.each(evtName => {
        events = this._events[evtName];

        util.each(event => {
            context = event.ctx;
            handle = event.handle;
            handle.apply(context, args);
        });
    });

    iteratee(eventNames);

    return this;
};

export { trigger };

const once = (eventName, handle, context) => {
    let waveHandle = (...args) => {
        removeEventListener(eventName, waveHandle);
        handle.apply(context, args);
    };

    return addEventListener(eventName, waveHandle, context);
};

export { once };



