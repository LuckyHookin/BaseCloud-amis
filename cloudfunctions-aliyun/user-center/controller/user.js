/**
 * v2.1.3
 */
'use strict';
const db = uniCloud.database();
const dbCmd = db.command ;
const $ = dbCmd.aggregate ;
const User = db.collection("uni-id-users");
const Role = db.collection("t_role");
const STATUS = [
	{title : "正常" , value : 0 },
	{title : "禁用" , value : 1 },
	{title : "待审核" , value : 2 },
	{title : "审核拒绝" , value : 3 },
] ;

module.exports = {
	
	login : async function(e){
		var {username , password} = this.params ;
		var res = await this.uniID.login({
			username , 
			password : password + ""
		});
		if (res.code) {
			return this.fail(res.msg);
		}
		return { uniIdToken : res.token , tokenExpired : res.tokenExpired } ;
	},
	
	checkToken: async function(e){
		var payload = await this.checkToken();
		return !payload.code ;
	},
	
	logout : async function(e){
		await this.uniID.logout(this.event.uniIdToken) ;
		return this.ok() ;
	},
	
	changeStatus : async function(e){
		var id = this.params.id ;
		var user = this.findFirst(await User.doc(id).get());
		if(null == user){
			return this.fail("用户信息不存在");
		}
		if (user.isSuperAdmin && user.status == 0) {
			return this.fail("超级管理员不可禁用");
		}
		var updateData = {status : user.status == 0 ? 1 : 0} ;
		if(updateData.status == 1){
			updateData.token = [] ;
		}
		await User.doc(id).update(updateData);
		return this.ok();
	},
	info : async function(e){
		var id = this.params.id ;
		var data = this.findFirst(await User.doc(id).get());
		if(null == data){
			return this.fail("用户信息不存在");
		}
		return {data};
	},
	save : async function(e){
		var data = this.getModel();
		var {username , password , _id , roleIds , mobile } = data ;
		var sameNameUser = this.findFirst(await User.where({username}).limit(1).get());
		if(  this.isRepeat(sameNameUser , _id) ){
			return this.fail("用户名已存在");
		}
		if(!!password){
			password = this.uniID.encryptPwd(password+"") ;
			data.password = password ;
		}else{
			delete data.password ;
		}
		if(!roleIds){
			return this.fail("请选择角色");
		}
		data.username = username ;
		data.mobile = mobile + "" ;
		data.roleIds = roleIds.split(",") ;
		var roleList = this.find(await Role.where({_id:dbCmd.in(data.roleIds)}).get() );
		data.roleType = roleList.map(role=>role.type);
		if( this.isNull(_id) ){
			data.status = 0 ;
			await User.add(data);
			return this.ok();
		}
		await this.updateById( User , data);
		return this.ok();
	},
	myInfo : async function({user}){
		var data = {
			username : user.username ,
			realname_auth : {
				contact_person : this.getDeepValue( ['realname_auth' , 'contact_person'] , user )
			},
			mobile : user.mobile ,
			comment : user.comment ,
			avatar : user.avatar
		};
		return {data};
	},
	modify:async function({user}){
		var data = this.getModel("x" , "password,mobile,comment,avatar,realname_auth");
		var password = data.password ;
		if(!!password){
			password = this.uniID.encryptPwd(password+"") ;
			data.password = password ;
			data.token = [] ;
		}else{
			delete data.password ;
		}
		data.mobile = data.mobile + "" ;
		await User.doc(user._id).update(data);
		return this.ok();
	},
	list : async function(res){
		const { pageNumber , pageSize } = this.params ;
		var page = await this.paginate({
			pageNumber ,
			pageSize , 
			collection : User ,
			where : { roleIds : dbCmd.exists(true) } ,
			eq:["status","username"] ,
			field : {
				"avatar" : true ,
				"username" : true ,
				"mobile" : true ,
				"isSuperAdmin" : true ,
				"comment" : true ,
				"register_date" : true ,
				"last_login_date" : true ,
				"last_login_ip" : true ,
				"realname_auth.contact_person" : true ,
				"roleIds" : true ,
				"roleNames" : true ,
				"status" : true 
			},
			orderBy : "register_date desc" ,
		});
		var list = page.list ;
		list.forEach(item=>{
			item.statusStr = this.getTitleByValue( STATUS , item.status) ;
		});
		return { page , statusList : STATUS };
	},
	delete : async function(e){
		var id = this.params.id ;
		var user = this.findFirst(await User.doc(id).get());
		if (null == user) {
			return this.fail("账号信息不存在");
		}
		if (user.isSuperAdmin && user.status == 0) {
			return this.fail("超级管理员不可禁用");
		}
		await User.doc(id).remove();
		return this.ok();
	}
};