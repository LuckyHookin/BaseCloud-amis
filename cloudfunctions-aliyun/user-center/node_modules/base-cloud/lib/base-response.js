/**
 * @description For the convenience of updating the version, do not modify this file
 */
const {isObject , isNull} = require("./base-type");

module.exports = {
	
	ok: function(msg) {
		return {
			state: 'ok',
			msg: msg || '操作成功'
		};
	},
	
	fail: function(msg, state) {
		return {
			state: !state ? 'fail' : state,
			msg: msg || "请求失败" ,
		};
	},
	
	isState : function(obj , state){
		return isObject(obj) && obj.state == state ;
	},
	
	isOk : function(obj){
		return this.isState(obj,'ok')  ;
	},
	
	isFail : function(obj){
		return this.isState(obj,'fail') ;
	},
	
	/**
	 * @description 获取默认响应结果
	 * @param {Object} res 业务函数的返回结果
	 * @param {Object} configs 配置参数
	 * @param {String} uniIdToken 需要重新下发给客户端的uniIdToken参数
	 * @return {Object} 返回默认响应结果
	 */
	getResponse : function ( res , configs , uniIdToken ){
		if (uniIdToken && isObject(res)) {
			res.uniIdToken = uniIdToken ;
		}
		if ( configs.alwaysState !== true || (isObject(res) && ( res.state || res.alwaysState === false ) ) ) {
			if ( isObject(res) && res.alwaysState === false ) {
				delete res.alwaysState ;
			}
			return res ;
		}
		if (typeof res === "undefined" || res === true ) {
			return this.ok() ;
		}
		if (res === false) {
			return this.fail() ;
		}
		if (!isObject(res)) {
			return res ;
		}
		var ok = this.ok();
		if (isNull(configs.dataKey)) {
			return { ...ok , ...res } ;
		}
		ok[configs.dataKey] = res ;
		return ok ;
	}	
}