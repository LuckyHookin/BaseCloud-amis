const fs = require("fs") ;

function getPathByAction( absolutePath , action ){
	var lastSplit = action ? action.lastIndexOf("/") : -1 ;
	var isDefault = fs.existsSync(`${absolutePath}/${action}.js`) ; //路径是否指向单函数
	var methodName = isDefault ? '' : action.substr( lastSplit + 1 ) ;
	var path = isDefault ? action : action.substr(0 , action.lastIndexOf("/"));
	return { path , methodName , isDefault } ;
}

function isHit(handles , action){
	for (var i = 0; i < handles.length; i++) {
		var item = handles[i] ;
		if ( ( Object.prototype.toString.call(item) === '[object RegExp]' && item.test(action)) || item == action  ) {
			return true ;
		}
	}
	return false ;
}

module.exports = {
	/**
	 * 根据请求路径查找业务函数
	 * @param {String} absolutePath
	 * @param {String} action
	 * @return {Function} 返回业务函数，当抛出异常时返回状态信息描述
	 */
	getFunction : function (absolutePath , action ){
		if (!action || action.indexOf("./") > -1) { //禁止使用相对路径访问其他目录
			return ;
		}
		var { methodName , path , isDefault  } = getPathByAction( absolutePath , action) ;
		var controller = null ;
		try{
			controller = require(`${absolutePath}/${path}`);
		}catch(e){
			if ( e.code == "MODULE_NOT_FOUND" ) {
				console.error(`action is undefined : ${action}`);
				return {
					state : 'actionError' ,
					msg: `action is undefined : ${action}`
				};
			}
			console.error(e);
			return {
				state : 'systemError' ,
				msg : e.message || '系统错误，请稍后再试'
			} ;
		}
		var fn = isDefault ? controller : controller[methodName] ;
		if (typeof fn != 'function') {
			console.error(`action is undefined : ${action}`);
			return {
				state : 'actionError' ,
				msg: `action is undefined : ${action}`
			};
		}
		return fn ;
	},
	
	/**
	 * 云函数URL化后返回标准响应结构体
	 */
	render : function (body = {} , headers = {} , isBase64 = false){
		return {
			mpserverlessComposedResponse: true, // 使用阿里云返回集成响应是需要此字段为true
			isBase64Encoded: isBase64 ,
			statusCode: 200 ,
			headers ,
			body
		};
	},
	
	isHandle : function ( inter , action){
		var handles = inter.handle || [];
		if (handles.length > 0) {
			return isHit(handles , action) ;
		}
		var clears = inter.clear || [] ;
		return !isHit(clears , action) ;
	}
}