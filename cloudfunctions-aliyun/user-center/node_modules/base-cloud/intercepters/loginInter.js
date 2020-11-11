module.exports = {
	handle : [] , //拦截的路径，此处留空表示拦截全部的路径
	clear : [ //配置要清除拦截器的路径，注意：如果配置了handle则此处的配置无效。
		"user-center/user/login", 
		"user-center/user/checkToken"
	] , 
	invoke : async function (){
		//校验本次请求携带的uniIdToken，如临过期将下发新的token
		var res = await this.checkToken();
		if(res.code){
			return {
				state : 'needLogin',
				msg : res.msg  
			};
		}
		//将刷新后的uniIdToken存储于当前线程，由默认响应结果返回给客户端，客户端自动刷新
		if (res.token) {
			this.setAttr({ uniIdToken : res.token , tokenExpired : res.tokenExpired }) ; 
		}
		//将user传入下一个拦截器，在拦截器函数的参数中可以获取到，也可以通过this.getAttr("user")来取到该值。
		this.setAttr({user : res.userInfo}); 
		//当前拦截器放行
		this.next();
	}
}