// Shootjs.js
// author: 法克
// email: 法克@163.com
// MIT license

import util from './util.js';

let empty = () => {};
let protocolExp = /^(file:|http:)/i;
let xmlExp = /^(?:text|application)\/xml/i;
let scriptExp = /^(?:text|application)\/script/i;
let escapeExp = /[&<>"'`]/g;
let htmlMimeType = 'text/html';
let jsonMimeType = 'application/json';
let escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
};

const __AJAX__CONSTANTS__ = {
    // 请求方式
    type: 'GET',

    // data编码
    contentType: 'application/x-www-form-urlencoded',

    // 成功回调
    success: empty,

    // 失败回调
    error: empty,

    // 请求前处理函数
    beforeSend: empty,

    // xmlhttprequest实例
    xhr() {
        return new window.XMLHttpRequest();
    },

    // dataType和mime映射
    accept: {
        text: 'text/plain',
        html: htmlMimeType,
        xml: 'text/xml,application/xml',
        script: 'text/javascript,application/script',
        json: jsonMimeType
    },

    // 是否异步
    async: true,

    // 是否html实体化
    escape: true,

    // 超时毫秒数
    millSecond: 0,

    processData: true
};

const parseOptions = (url, data, dataType, success) => {
    if (util.getType(data) === 'function') {
        success = data;
        data = void 0;
    }

    return {
        url: url,
        data: data,
        dataType: dataType,
        success: success
    };
};

const mimeToDataType = (mime) => {
    return mime === htmlMimeType ? 'html' :
        mime === jsonMimeType ? 'json' :
        xmlExp.test(mime) ? 'xml' :
        scriptExp.test(mime) ? 'script' : 'text';
};

const escape = function (html) {
    return html.replace(escapeExp, function (match) {
        return escapeMap[match];
    });
};

const ajaxError = (type, func, error) => {
    func.apply(type, error);
};

export const ajax = option => {
    let ajaxOption = util.extend({}, __AJAX__CONSTANTS__, option);
    let xhr = ajaxOption.xhr();
    let dataType = ajaxOption.dataType;
    let mime = ajaxOption.accept[dataType] || '*/*';
    let header = util.extend({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': mime,
        'Content-Type': ajaxOption.contentType
    }, option.header);
    let beforeSend = ajaxOption.beforeSend;
    let millSecond = ajaxOption.millSecond, timeout, protocol, result;

    // 创建http请求
    xhr.open(ajaxOption.type, ajaxOption.url, ajaxOption.async, ajaxOption.username, ajaxOption.password);
    // 解决firefox中如果服务器没有设置content-Type，那么浏览器不会使用默认mime去解析
    xhr.overrideMimeType && xhr.overrideMimeType(mime);

    // 设置http请求头
    util.each(header)((value, name) => {
        xhr.setRequestHeader(name.toLowerCase(), value);
    });

    // 发送http请求前的处理，如果不成功，则终止发送请求，并且提示
    if (beforeSend && beforeSend(ajaxOption) === false) {
        xhr.abort();
        ajaxError('请求前处理错误', ajaxOption.error, null);
        return;
    }

    // 超时处理
    if (millSecond > 0) {
        timeout = setTimeout(function () {
            xhr.abort();
            ajaxError('请求超时', ajaxOption.error, null);
        }, millSecond);
        return;
    }

    // 添加xhr状态改变处理器
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            xhr.onreadystatechange = null;
            clearTimeout(timeout);
            protocol = protocolExp.test(location.protocol) && RegExp.$1;

            // 如果服务器返回状态码是200、304、请求本地文件时候
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || (protocol === 'file:' && xhr.status === 0)) {
                dataType || (dataType = mimeToDataType(xhr.getResponseHeader('content-type')));

                if (xhr.responseType === 'arraybuffer' || xhr.responseType === 'blob') {
                    result = xhr.response;
                } else {
                    result = xhr.responseText;

                    try {
                        if (dataType === 'script') result = (0, eval)(result);
                        else if (dataType === 'json') result = JSON.parse(result);
                        else if (dataType === 'xml') result = xhr.responseXML;
                        else if (dataType === 'html') result = ajaxOption.escape ? escape(result) : result;
                    }
                }

            }
        }
    };
};

export const get = (...args) => {

};

export const post = (...args) => {

};

export const getJSON = (url, data, success) => {

};