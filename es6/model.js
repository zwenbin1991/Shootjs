// Shootjs.js
// author: 法克
// email: 法克@163.com
// MIT license

'use strict';

import util from './util.js';
import event from './event.js';
import { fork } from './fork.js';

export const Model = attributes => {
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
        var attrs, dynamic, unset, changes, iteratee, prev, current;

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
        current = this.attributes;
        iteratee = util.each((val, key) => {
            // 记录改变的key
            if (!util.isEqual(val, current[key])) changes.push(key);

            unset ? delete current[key] : (current[key] = val);
        });

        this.identify in attrs && (this.id = attrs[this.identify]);

        if (dynamic) {
            iteratee = each(key => {
                this.trigger('change:' + key, this, current[key]);
            });
        }

        return this;
    },

    clear(option) {
        var attr = {};
        var iteratee = each((value, key) => {
            attr[key] = void 0;
        });

        iteratee(this.attributes);

        return this.set(attr, util.extend({}, option, { unset: true }))
    }
});