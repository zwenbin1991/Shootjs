/**
 * @name model.js
 * @description shootjs的model类
 * @author 法克@163.com
 * @date 2016-4-27
 * @version 1.0.0
 */

'use strict';

import util from './util.js';
import event from './event.js';
import { fork } from './fork.js';

const Model = attributes => {
    this.mid = util.uniqueId('m');
    this.attributes = util.extend(this.defaultAttributes, attributes || {});
    this.set(attributes);
    this.initialize.call(this, attributes);
};

Model.fork = fork;

util.extend(Model.prototype, event, {
    defaultAttributes: {},

    identify: 'id',

    toJSON() {
        return util.extend({}, this.attributes);
    },

    get(name) {
        return this.attributes[name];
    },

    set(name, value, option) {
        var attrs, attr, dynamic, unset, changes, iteratee, prev, current;

        if (util.isPlainObject(name)) {
            attrs = name;
            option = value;
        } else {
            (attrs = {})[name] = value;
        }

        option || (option = {});

        // 改变model，是否触发对应的model change事件
        dynamic = !!option.dynamic;
        // 是否是删除操作
        unset = !!option.unset;
        prev = this.previousAttributes = this.toJSON();
        current = this.toJSON();
        iteratee = util.each(function (val, key) {
            // 记录改变的key
            if (!util.isEqual(val, current[key])) changes.push(key);
        });

        this.identify in attrs && (this.id = attrs[this.identify]);


    },

    clear() {

    }



});

export { Model };