/**
 * v2.1.3
 */
'use strict';
const db = uniCloud.database();
const dbCmd = db.command ;
const $ = db.command.aggregate ;
const Role = db.collection("t_role");
const TYPE_LIST = [
	{title : "管理方" ,value : 1 },
	{title : "普通用户" ,value : 2 },
	{title : "分销商" ,value : 3 }
] ;

module.exports = {
	info : async function(e){
		var id = this.params.id ;
		var typeList = TYPE_LIST ;
		if (!id) {
			return { typeList };
		}
		var data = this.findFirst( await Role.doc(id).get() );
		return { data , typeList };
	},
	
	save : async function(e){
		var data = this.getModel();
		if (data.menuIds) {
			data.menuIds = data.menuIds.split(',');
		}
		if (!data._id) {
			data.createTime = Date.now();
			await Role.add(data);
			return this.ok();
		}
		var roleInDb = this.findFirst(await Role.doc(data._id).get());
		if (null == roleInDb) {
			return this.fail("角色信息不存在");
		}
		if (roleInDb.type != data.type) {
			return this.fail("请勿修改角色类型");
		}
		data.updateTime = Date.now() ;
		await this.updateById(Role , data);
		return this.ok();
	},
	
	delete : async function(e){
		var id = this.params.id ;
		await Role.doc(id).remove();
		return this.ok();
	},
	
	list : async function(res){
		var dataInDB = await Role.field({
			"name" : 1 ,
			"type" : 1 ,
			"updateTime" : 1 ,
			"remark" : 1 
		}).orderBy("createTime","asc").get() ;
		var list = this.find( dataInDB );
		list.forEach(item=>{
			item.typeStr = this.getTitleByValue( TYPE_LIST , item.type);
		});
		return {list};
	},
	
	options : async function(res){
		var dataInDB = await Role.field({
			"_id" : true ,
			"name" : true ,
		}).orderBy("createTime","asc").get() ;
		var list = this.find( dataInDB );
		return {list};
	}
};