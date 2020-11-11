'use strict';
const db = uniCloud.database();
const dbCmd = db.command ;
const $ = db.command.aggregate ;

/**
 * 本业务函数访问路径以curl/private开头，符合base-cloud-config.js中的closeInter拦截规则，不对外开放访问，内部动态路由调用使用
 */
module.exports = {
	/**
	 * 订单付款成功，不对方开放访问(示例)
	 */
	paySuccess : async function(e){
		this.log("付款成功，处理中……");
	}
}