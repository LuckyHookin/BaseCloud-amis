module.exports = {
	clear : [
		"admin/menu/globalData",
		"user-center/user/login",
		"user-center/user/checkToken",
		"user-center/user/logout"
	],
	invoke : authInter
} ;

const db = uniCloud.database();
const dbCmd = db.command;
const $ = dbCmd.aggregate ;
const Role = db.collection("t_role");
const Menu = db.collection("t_menu");

async function getAuthMenuWithRoleIds( roleIds , reqRoute , isSuperAdmin , vm){
	if (isSuperAdmin) {
		return await getAuthMenu(reqRoute , vm) ;
	}
	var dataInDb = await db.collection("t_role").aggregate().match({
		_id : dbCmd.in(roleIds)
	}).project({
		_id : 0 ,
		menuIds : 1
	}).unwind("$menuIds").group({
		_id : "$menuIds"
	}).lookup({
		from : "t_menu" ,
		localField: "_id" ,
		foreignField: "_id" ,
		as : "menus"
	}).project({
		menu : $.arrayElemAt(["$menus",0])
	}).replaceRoot({
		newRoot:"$menu"
	}).match({
		url : dbCmd.eq(reqRoute)
	}).project({
		"parentId" : 1 ,
		"name" : 1 ,
		"url" : 1 ,
		"saveLogUrl" : 1 
	}).end();
	return vm.findFirst( dataInDb );
}

async function getAuthMenu( reqRoute , vm ){
	return vm.findFirst( await Menu.where({ 
		url : dbCmd.eq(reqRoute)
	}).limit(1).get() );
}

async function saveOperateLog(authMenu , user , _this){
	var fullPath = _this.fullPath ;
	if (!authMenu.saveLogUrl || authMenu.saveLogUrl.indexOf(fullPath) == -1) {
		return ;
	}
	var parentName = "" ;
	var menuId = authMenu.parentId ;
	if (menuId) {
		var parentMenu = _this.findFirst(await Menu.doc(menuId).get());
		parentName = null == parentMenu ? "" : parentMenu.name ;
	}
	
	await db.collection("t_operate_log").add({
		createTime : Date.now() ,
		actionName : fullPath ,
		userName : user.username ,
		name :  parentName ? `${parentName} > ${authMenu.name}` : authMenu.name ,
		params : JSON.stringify(_this.params) , //阿里云不支持含有特殊字符的key的json，如{x.name:''}所以转成字符串存储
		ip : _this.ctx.CLIENTIP
	});
}


async function authInter({user}){
	const {event , ctx  , fnName , action , fullPath} = this ;
	if(!user){
		this.next();
		return ;
	}
	
	var roleIds = user.roleIds ;
	var authMenu = await getAuthMenuWithRoleIds( roleIds , fullPath , user.isSuperAdmin , this );
	if( null == authMenu ){
		return {
			state : "noAuth" ,
			msg : "无操作权限"
		};
	}
	
	//存储操作日志
	await saveOperateLog(authMenu , user , this);
	
	this.next();
}

