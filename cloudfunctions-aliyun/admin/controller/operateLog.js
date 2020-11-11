/**
 * v2.1.3
 */
'use strict';
const db = uniCloud.database();
const dbCmd = db.command ;
const $ = db.command.aggregate ;
const OperateLog = db.collection("t_operate_log");

module.exports = async function(res){
	var {pageNumber , pageSize } = this.params ;
	
	var page = await this.paginate({
		pageNumber , pageSize ,
		collection : OperateLog ,
		eq : ["actionName","userName"],
		range : ["createTime,createTimeStart,createTimeEnd"],
		like : ["name"],
		orderBy : "createTime desc" 
	});
	
	return {page};
};