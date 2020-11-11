/**
 * v2.1.3
 */
'use strict';
const db = uniCloud.database();
const dbCmd = db.command ;
const $ = db.command.aggregate ;
const Menu = db.collection("t_menu");
const MENU_TYPES = [
	{title:"一级菜单",value:1},
	{title:"二级菜单",value:2},
	{title:"操作类",value:3}
];
const PLATFORMS = [
	{title:"全部",value:1},
	{title:"电脑端",value:2},
	{title:"移动端",value:3}
] ;

async function getMenuListByUser(user){
	var baseFields = {
		"type": 1,
		"icon": 1,
		"name": 1,
		"key": 1,
		"isShow" : 1 ,
		"orderNum": 1,
		"saveLogUrl":1,
		"parentId": 1,
		"platform": 1,
		"url": 1,
		"pages":1,
	};
	if (user.isSuperAdmin) {
		return await Menu.aggregate().lookup({
			from:"t_menu",
			localField:"parentId",
			foreignField:"_id",
			as:"parentMenus"
		}).project({
			...baseFields,
			parentMenu : $.arrayElemAt(["$parentMenus" , 0])
		}).project({
			...baseFields,
			parentOrderNum : "$parentMenu.orderNum"
		}).sort({
			"parentOrderNum" : 1 ,
			"orderNum" : 1 
		}).limit(3000).end();
	}
	
	return await db.collection("t_role").aggregate().match({
			_id : dbCmd.in(user.roleIds)
		}).project({
			_id : 0 ,
			menuIds : 1
		}).unwind("$menuIds").group({
			_id : "$menuIds"
		}).lookup({
			from:"t_menu",
			foreignField:"_id",
			localField:"_id",
			as : "menuList"
		}).project({
			_id : 0 ,
			menu : $.arrayElemAt(["$menuList",0])
		}).replaceRoot({
			newRoot:"$menu"
		}).lookup({
			from:"t_menu",
			foreignField:"_id",
			localField:"parentId",
			as : "parentMenus"
		}).project({
			...baseFields,
			parentMenu : $.arrayElemAt(["$parentMenus" , 0])
		}).project({
			...baseFields,
			parentOrderNum : "$parentMenu.orderNum"
		}).sort({
			"parentOrderNum" : 1 ,
			"orderNum" : 1 
		}).limit(3000).end();
}

module.exports = {
	
	/**
	 * 根据菜单类型查询菜单列表
	 * @return 一级菜单列表 | 二级菜单列表 | 三级菜单列表
	 */
	listByType : async function(e){
		var type = this.params.type ;
		var dataInDB = await Menu.where({type}).orderBy("orderNum","asc").field({
			name : true 
		}).get();
		var list = this.find(dataInDB);
		return { list };
	} ,
	
	/**
	 * 查询用户拥有的菜单权限
	 */
	globalData : async function(e){
		var user = e.user ;
		var dataInDb = await getMenuListByUser(user);
		var list = this.find(dataInDb);
		return {
			list ,
			user : {
				username : user.username ,
				isSuperAdmin : user.isSuperAdmin
			}
		} ;
	},
	
	info : async function(e){
		var id = this.params.id ;
		if (!id) {
			return {};
		}
		var data = this.findFirst( await Menu.doc(id).get() );
		if (null == data) {
			return {} ;
		}
		if(data.url){
			data.url = data.url.join(";") ;
		}
		if(data.saveLogUrl){
			data.saveLogUrl = data.saveLogUrl.join(";") ;
		}
		return { data };
	},
	
	save : async function(res){
		var data = this.getModel();
		await this.setMaxOrderNum(data , Menu , { parentId : data.parentId } );
		if(!!data.url){
			data.url = data.url.split(";");
		}
		if(!!data.saveLogUrl){
			data.saveLogUrl = data.saveLogUrl.split(";");
		}
		data.type = parseInt(data.type);
		if (data.type == 3) {
			data.isShow = true ;
		}
		if (!data._id) {
			await Menu.add(data);
			return this.ok();
		}
		await this.updateById(Menu , data);
		return this.ok();
	},
	
	delete : async function(e){
		var id = this.params.id ;
		var total = (await Menu.where({"parentId" : id}).count()).total ;
		if (total > 0) {
			return this.fail("请先删除子菜单");
		}
		await Menu.doc(id).remove();
		return this.ok();
	},
	
	list : async function(e){
		var fields = {
			name : 1 ,
			url : 1 ,
			isShow : 1 ,
			saveLogUrl : 1 ,
			parentId : 1 ,
			type : 1 ,
			pages : 1 ,
			key : 1 ,
			orderNum : 1 ,
			platform : 1
		};
		var dataInDB = await Menu.aggregate().lookup({
			from:"t_menu",
			localField:"parentId",
			foreignField:"_id",
			as:"parentMenus"
		}).project({
			...fields ,
			parentMenu : $.arrayElemAt(["$parentMenus" , 0])
		}).project({
			...fields ,
			parentOrderNum : "$parentMenu.orderNum"
		}).sort({
			"parentOrderNum" : 1,
			"orderNum" : 1
		}).limit(3000).end();
		var list = this.find( dataInDB );
		list.forEach(item=>{
			item['typeName'] = this.getTitleByValue(MENU_TYPES , item.type);
			item['platformStr'] = this.getTitleByValue(PLATFORMS , item.platform || 1);
			item.url = item.url ? item.url.join(";") : '' ;
			item.saveLogUrl = item.saveLogUrl ? item.saveLogUrl.join(";") : '' ;
		});
		return {list , menuTypeList : MENU_TYPES , platformList : PLATFORMS };
	}
};