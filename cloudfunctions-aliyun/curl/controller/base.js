'use strict';
const db = uniCloud.database();
const dbCmd = db.command ;
const $ = db.command.aggregate ;

module.exports = {
	/**
	 * 接收通知(示例)
	 */
	getNotify : async function(e){
		//...其他的业务逻辑
		this.log("收到通知，处理中…")
		return this.forward("private-order/paySuccess");
	}
}