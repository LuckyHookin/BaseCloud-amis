/**
 * URL化接口
 */
'use strict';
const BaseCloud = require("base-cloud");

exports.main = async ( event , ctx ) => {
	var baseCloud = new BaseCloud({ event, ctx , fnName : "curl" });
	baseCloud.setInters({
		loginInter : {
			clear : [/^curl\//]
		}
	});
	return await baseCloud.invoke(`${__dirname}/controller`);
};