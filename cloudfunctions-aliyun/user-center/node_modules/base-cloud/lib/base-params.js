/**
 * @description For the convenience of updating the version, do not modify this file
 */
const { deepMerge , keep } = require("./base-object") ;

function getJsonByKeys(keys , value){
	var data = {} ;
	var lastDot = keys.lastIndexOf(".") ;
	if (lastDot == -1) {
		data[keys] = value ;
		return data ;
	}
	//内部data
	var innerKey = keys.substr(lastDot+1);
	var innerData = {} ;
	innerData[innerKey] = value ;
	
	//剩余data
	var key = keys.substr(0 , lastDot) ;
	return getJsonByKeys( key , innerData ) ;
}

module.exports = {
	/**
	 * @param {String} prefix 前缀
	 * @param {String} 选填，指定要保留的键名，无须包含前缀，多个使用英文逗号分开；不指定该参数时保留所有的带前缀的参数
	 * @param {Object} 选填，当uniCloud.baseCloud.getModel()时必填参数  
	 * {
		 "x.name" : "王小二" ,
		 "x.school.name" : "北京大学",
		 sex : "女"
	  }
	  过滤后：
	  {
		  name : "王小二" ,
		  school : {
			  name : "北京大学"
		  }
	  }
	 */
	getModel: function( prefix = "x" , keepKeys , params ) {
		var data = {};
		params = params || this.params || {} ;
		for (var key in params) {
			if ( !!prefix && key.indexOf(prefix + ".") == -1) {
				continue ;
			}
			var value = params[key] ;
			if (!!prefix) {
				key = key.replace(prefix + ".", '') ;
			}
			var curData = getJsonByKeys( key , value ) ;
			data = deepMerge(data , curData) ;
		}
		return keep( data , keepKeys) ;
	},
}