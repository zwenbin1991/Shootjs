/*
url如果有#取开始到#之间的字符
如果存在processData为true时，并且data不是字符串

serializeData包括
    1、判断processData是否为true，在判断data是否为数组或者对象 调用$.param传入(option.data, option.traditional);
    2、$.param，自定义一个数组，并且赋予它add方法，用于给自身增加数据，调用serialize方法
    3、

 $.param = function(obj, traditional){
     var params = []

     params.add = function(key, value) {
         if ($.isFunction(value)) value = value()
         if (value == null) value = ""
            this.push(escape(key) + '=' + escape(value))
     }

     serialize(params, obj, traditional)
     return params.join('&').replace(/%20/g, '+')
 }


 function serialize(params, obj, traditional, scope){
     var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
     $.each(obj, function(key, value) {
         type = $.type(value)

         if (scope) key = traditional ? scope :
         scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'

        传入数组的话必须传入[{ name: 'xx , value: value}]
        对象分两种
            1、一种是值为普通类型的对象{name: 'xx'}
            2、一种是值为复杂类型的对象 {xx: [ {name: '', value: } ]}
        如果是null或者函数，其他的通过encodeURIComponent

         // handle data in serializeArray() format
         if (!scope && array) params.add(value.name, value.value)

         // recurse into nested objects
         else if (type == "array" || (!traditional && type == "object"))

         serialize(params, value, traditional, key)

         else params.add(key, value)
     })
 }

 设置了url后，如果后面包括了?xx=?的时候，自动设置dataType = 'jsonp'
 是否设置了ajax的缓存，否，或者dataType='jsonp'

 设置了dataType: 'jsonp
 如果没有设置xx=?，如果设置了jsonp: 相当于key x=? :
 如果得到了
    路由出现xxoo=?，则自动设置dataType='jsonp'
    如果没有出现xxoo=?，如果设置了dataType='jsonp', jsonp不为false那么赋予jsonp=?或者callback=?
    overrideMimeType()设置浏览器的资源媒体类型


 accepts: {
     script: 'text/javascript, application/javascript, application/x-javascript',
     json:   jsonType,
     xml:    'application/xml, text/xml',
     html:   htmlType,
     text:   'text/plain'
 },




* */