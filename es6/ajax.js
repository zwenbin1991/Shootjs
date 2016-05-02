// Shootjs.js
// author: 法克
// email: 法克@163.com
// MIT license

'use strict';

import util from './util.js';

let empty = () => {};

const __AJAX__CONSTANTS__ = {
    type: 'GET',
    success: empty,
    error: empty,
    xhr() {
        return new window.XMLHttpRequest();
    },
    processData: true
};

const parseOptions = (url, data, dataType, success) => {
    if (util.getType(data) === 'function') {
        success = data;
        data = void 0;
    }

    return {
        'url': url,
        'data': data,
        'dataType': dataType,
        'success': success
    };
};

const initializeAjax = function () {

};

export const ajax = option => {
    let ajaxOption = util.extend({}, __AJAX__CONSTANTS__, option);

};

export const get = (...args) => {

};

export const post = (...args) => {

};

export const getJSON = (url, data, success) => {

};