/**
 * 管理端相关函数
 */
'use strict';
const BaseCloud = require("base-cloud");
const ub = uniCloud.baseCloud ;

exports.main = async ( event , ctx ) => {
	var fnName = "admin" ; //当前云函数的名称
	var controlerDir = `${__dirname}/controller` ; //存放业务函数根目录的绝对路径
	return await new BaseCloud({ event, ctx , fnName }).invoke(controlerDir);
};

