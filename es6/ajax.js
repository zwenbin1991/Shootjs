// Shootjs.js
// author: 法克
// email: 法克@163.com
// MIT license

import util from './util.js';

let empty = () => {};
let nativeEncode = encodeURIComponent;
let protocolExp = /^(file:|http:)/i;
let xmlExp = /^(?:text|application)\/xml/i;
let scriptExp = /^(?:text|application)\/script/i;
let escapeExp = /[&<>"'`]/g;
let jsonpExp = /(.*?)=\?/;
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

    // 将非字符串的data转换成查询字符串
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

const ajaxError = (error, func, type) => {
    func(error, type);
};

const ajaxSuccess = (data, func) => {
    func(data, 'success');
};

const handleData = (option) => {
    // 如果是post请求并且存在data
    if (option.processData && !util.isNothing(option.data) && !util.isString(option.data)) option.data = param(option.data);
    if (option.type.toLowerCase() === 'get' && !util.isNothing(option.data)) option.url = appendQuery(option.url, option.data), delete option.data;
};

const appendQuery = (url, query) =>
    util.isNothing(query) ? url : url + '&' + query.replace(/[&?]/, '?');

const serialize = (result, data) => {
    let checkArray = util.isArray(data);

    util.each((value, key) => {
        if (checkArray) result.add(value.value, value.key);
        else if (util.isPlainObject(value)) serialize(result, value);
        else result.add(value, key);
    })(data);
};

const createJSONPUrl = option => {
    if (option.url) option.url = appendQuery(option.url, (option.jsonp || 'callback') + '=?');
};

const jsonp = option => {
    let callbackName = option.jsonpCallback;
    let jsonpCallbackName = (util.getType(callbackName) === 'function' ? callbackName() : callbackName);
    let script = document.createElement('script'), result;

    script.src = option.url.replace(jsonpExp, '$1=' + jsonpCallbackName);
    script.onload = () => {
        script.onload = null;
        document.head.removeChild(script);
        ajaxSuccess(result, option.success);
    };
    script.onerror = (error) => {
        script.onerror = null;
        document.head.removeChild(script);
        ajaxError(error, option.error, 'js文件加载错误');
    };
    document.head.appendChild(script);

    window[jsonpCallbackName] = (...args) => {
        result = args[0];
    };
 };

export const param = data => {
    let params = [];
    params.add = function (value, key) {
        value || (value = '');
        this.push(nativeEncode(key) + '=' + nativeEncode(value));
    };
    serialize(params, data);

    return params.join('&');
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
    let millSecond = ajaxOption.millSecond;
    let isSupportJSONP = jsonpExp.test(ajaxOption.url), timeout, protocol, result;

    if (isSupportJSONP) dataType = 'jsonp';

    // 如果是使用jsonp跨域
    if (dataType === 'jsonp') {
        !isSupportJSONP && createJSONPUrl(ajaxOption);
        return jsonp(ajaxOption);
    }

    // 数据处理
    handleData(ajaxOption);
    // 创建http请求
    xhr.open(ajaxOption.type, ajaxOption.url, ajaxOption.async, ajaxOption.username, ajaxOption.password);
    // 解决firefox中如果服务器没有设置content-Type，那么浏览器不会使用默认mime去解析
    xhr.overrideMimeType && xhr.overrideMimeType(mime);

    // 设置http请求头
    util.each((value, name) => {
        xhr.setRequestHeader(name.toLowerCase(), value);
    })(header);

    // 发送http请求前的处理，如果不成功，则终止发送请求，并且提示
    if (beforeSend && beforeSend(ajaxOption) === false) {
        xhr.abort();
        ajaxError(null, ajaxOption.error, '请求前处理错误');
        return;
    }

    // 超时处理
    if (millSecond > 0) {
        timeout = setTimeout(function () {
            xhr.abort();
            ajaxError(null, ajaxOption.error, '请求超时');
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
                    } catch (e) {
                        ajaxError(null, ajaxOption.error, '转换错误');
                        return;
                    }

                    ajaxSuccess(result, result.success);
                }
            }
        }
    };
    xhr.send(ajaxOption.data ? serialize(ajaxOption.data) : null);
};

/*
* get请求
* */
export const get = (...args/* url, data, dataType, success */) => {
    return ajax(parseOptions.apply(null, args));
};

// post请求
export const post = (...args) => {
    var option = parseOptions.apply(null, args);
    option.type = 'POST';

    return ajax(option);
};

// get请求，解析成json格式
export const getJSON = (...args) => {
    var option = parseOptions.apply(null, args);
    option.dataType = 'json';

    return ajax(option);
};