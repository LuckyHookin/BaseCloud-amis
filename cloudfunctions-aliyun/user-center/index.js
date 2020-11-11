'use strict';
/**
 * 用户相关的API，该模块依赖uniId
 */
const BaseCloud = require("base-cloud");
const uniID = require("uni-id");

exports.main = async ( event , ctx ) => {
	var baseCloud = new BaseCloud({ event, ctx , fnName : "user-center" , uniID });
	return await baseCloud.invoke(`${__dirname}/controller`);
};
