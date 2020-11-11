/**
 * @description For the convenience of updating the version, do not modify this file
 */
const {
	isNull,
	isObject,
	isEmptyObject,
	isString,
	isArray
} = require("./base-type");
const querystring = require("querystring");

function parseJson(event) {
	var queryString = event.queryStringParameters ;
	if( isObject(queryString) &&  !isEmptyObject(queryString)){
		return queryString ; 
	}
	var str = event.body ;
	if( isObject(str) && !isEmptyObject(str)){
		return str ;
	}
	if (isNull(str)) {
		return {} ;
	}
	if (isXmlStr(str)) {
		return str;
	}
	try {
		return JSON.parse(str);
	} catch (e) {
		return parseQueryString(str);
	}
}

function parseQueryString(str) {
	try {
		var queryParams = querystring.parse(str);
		if (isObject(queryParams)) {
			var keys = Object.keys(queryParams);
			if (keys.length == 1 && keys[0] == str) {
				return str;
			}
		}
		return queryParams;
	} catch (e) {
		return str;
	}
}

function isXmlStr(str) {
	return str && str.indexOf("<xml>") == 0 && str.indexOf("</xml>") == str.length - 6;
}

/**
 * 深度合并json对象
 */
function deepMerge() {
	var args = [...arguments];
	var originObj = args[0];
	var mergeObj = args[1];
	for (var key in mergeObj) {
		isObject(originObj[key]) ? deepMerge(originObj[key], mergeObj[key]) : originObj[key] = mergeObj[key];
	}
	args.splice(0, 2, originObj);
	return args.length == 1 ? originObj : deepMerge(...args);
}

module.exports = {
	/**
	 * 深度合并json对象
	 */
	deepMerge,

	/**
	 * 根据深层路径，从json对象中取值
	 * @param {Array | String} path 路径，如['user','wx','open_id'] 或字符串类型：'user.wx.open_id'
	 * @param {Object} obj 目标json对象
	 */
	getDeepValue: function(path, obj) {
		if (isString(path)) {
			path = path.split('.');
		}
		path.forEach(function(el) {
			try {
				obj = obj[el]
			} catch (e) {
				obj = null
			};
		});
		return obj
	},

	/**
	 * 根据标准options数组对象中的value获取title
	 * @param {Array} list 标准options数组
	 * @param {String | Number} value 当前的值
	 */
	getTitleByValue: function(list, value) {
		var item = list.find(item => item.value == value);
		return item ? item.title : "";
	},

	/**
	 * 从一个json对象中保留指定的键名
	 * @param {Object} data json对象
	 * @param {String} keys 要删除的键名，多个使用英文逗号隔开
	 */
	keep: function(data, keys) {
		if (!keys || !isObject(data)) {
			return data;
		}
		var keyArr = keys.split(",");
		for (let key in data) {
			if (keyArr.indexOf(key) == -1) {
				delete data[key];
			}
		}
		return data;
	},

	parseUrlParams: parseJson
}
