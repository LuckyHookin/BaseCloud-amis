/**
 * v2.1.3
 */
'use strict';
const db = uniCloud.database();
const dbCmd = db.command ;
const $ = db.command.aggregate ;
const swiperList = db.collection("swiperList");

module.exports = {
	save : async function(e){
		let data = this.keep( this.params , "_id,image,title,url");
		if (!data._id) {
			data.createTime = Date.now();
			await swiperList.add(data);
			return this.ok();
		}
		var roleInDb = this.findFirst(await swiperList.doc(data._id).get());
		if (null == roleInDb) {
			return this.fail("信息不存在");
		}
		data.updateTime = Date.now() ;
		await this.updateById(swiperList , data);
		return this.ok();
	},
	
	delete : async function(e){
		var id = this.params._id ;
		await swiperList.doc(id).remove();
		return this.ok();
	},
	
	list : async function(res){
		var dataInDB = await swiperList.field({
			"image" : 1 ,
			"title" : 1 ,
			"url" : 1 
		}).get() ;
		var list = this.find( dataInDB );
		return {data:{items:list}};
	}
};