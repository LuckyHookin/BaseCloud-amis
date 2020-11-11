/**
 * @description For the convenience of updating the version, do not modify this file
 */
function isNull(obj) {
	return obj !== 0 && obj !== false && !obj ;
}

function isObject(obj) {
  return !isNull(obj) && Object.prototype.toString.call(obj) === '[object Object]'
}

module.exports = {
	isNull ,
	isObject,
	isEmptyObject:function (obj){
		return isObject(obj) && Object.keys(obj).length == 0 ;
	},
	
	isFn : function(fn){
		return typeof fn == "function" ;
	},
	
	isNumber:function(num){
		return !Array.isArray(num) && num !== false && num !== true && !isNaN(Number(num)) ;
	},
	
	isArray:function(arr){
		return Array.isArray(arr);
	},
	
	isString : function(obj){
		return  Object.prototype.toString.call(obj) === '[object String]' ;
	},
	
	isDate:function(obj){
		return Object.prototype.toString.call(obj) === '[object Date]' ;
	},
	
	isReg:function(obj){
		return Object.prototype.toString.call(obj) === '[object RegExp]' ;
	}
	
};