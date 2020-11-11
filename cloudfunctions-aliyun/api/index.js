/**
 * 用户端的API接口
 */
'use strict';
const BaseCloud = require("base-cloud");

exports.main = async ( event , ctx ) => {
	var baseCloud = new BaseCloud({ event, ctx , fnName : "api" });
	baseCloud.setInters({
		authInter : {
			handle : [] ,  //覆盖全局的拦截配置
			clear : [/^api\//]
		}
	});
	return await baseCloud.invoke(`${__dirname}/controller`);
};