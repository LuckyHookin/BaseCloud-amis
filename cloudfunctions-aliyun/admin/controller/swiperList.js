/**
 * v2.1.3
 */
'use strict';
const db = uniCloud.database();
const dbCmd = db.command ;
const $ = db.command.aggregate ;
const Role = db.collection("swiperList");

module.exports = {
	info : async function(e){
		var id = this.params.id ;
		var data = this.findFirst( await Role.doc(id).get() );
		return { data };
	},
	
	save : async function(e){
		let data = this.keep( this.params , "_id,image,title,url");
		if (!data._id) {
			data.createTime = Date.now();
			await Role.add(data);
			return this.ok();
		}
		var roleInDb = this.findFirst(await Role.doc(data._id).get());
		if (null == roleInDb) {
			return this.fail("信息不存在");
		}
		// if (roleInDb.type != data.type) {
		// 	return this.fail("请勿修改角色类型");
		// }
		data.updateTime = Date.now() ;
		await this.updateById(Role , data);
		return this.ok();
	},
	
	delete : async function(e){
		var id = this.params._id ;
		await Role.doc(id).remove();
		return this.ok();
	},
	
	list : async function(res){
		var dataInDB = await Role.field({
			"image" : 1 ,
			"title" : 1 ,
			"url" : 1 
		}).get() ;
		var list = this.find( dataInDB );
		return {data:{items:list}};
	}
};