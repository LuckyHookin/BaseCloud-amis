/**
 * v2.1.22
 * @description For the convenience of updating the version, do not modify this file
 */
"use strict";
const fs = require("fs");
const db = uniCloud.database();
const dbCmd = db.command;

const Config = require("./base-cloud-config.js");
const baseCrypto = require("./lib/base-crypto") ;
const baseType = require("./lib/base-type") ;
const baseObject = require("./lib/base-object") ;
const DateKit = require("./lib/base-date") ;
const baseDatabase = require("./lib/base-database") ;
const baseResponse = require("./lib/base-response") ;
const baseParams = require("./lib/base-params") ;
const baseMath = require("./lib/base-math") ;
const baseToken = require("./lib/base-token") ;
const { getFunction , render , isHandle , isHit } = require("./lib/base-core") ;
const jwt = require("./lib/jwt-simple") ; //jsonwebtoken

/**
 * 挂载基础方法
 */
function mountMethods(){
	uniCloud.baseCloud = {
		...baseCrypto ,
		...baseType ,
		...baseObject ,
		...baseResponse ,
		...baseDatabase ,
		...baseParams ,
		...baseMath ,
		jwt ,
		DateKit 
	};
}

/**
 * BaseCloud对象
 */
function BaseCloud( { event, ctx , fnName , uniID } ) {
	mountMethods();
	this.uniID = uniID ;
	this.setConfigs();
	var isUrlRequest = !ctx.PLATFORM && !ctx.APPID && !!ctx.body && !!ctx.body.path && !!ctx.body.httpMethod  ;
	this.event = event ;
	this.ctx = ctx;
	this.params = event.params ;
	this.action = event.action ;
	this.fnName = fnName ;
	if (isUrlRequest){
		this.params = baseObject.parseUrlParams(event) || {} ;
		this.action = event.path ? event.path.substr(1) : '' ;
		if ( !this.action && this.isObject(this.params) && this.params.action) { //兼容老版本，后续会移除该逻辑
			this.action = this.params.action ;
			delete this.params.action ;
		}
		this.event.uniIdToken = this.event.headers.uniidtoken || this.event.headers.uniIdToken ;
		this.event.params = this.params ;
		this.event.action = this.action ;
	}
	this.token = this.event.uniIdToken;
	this.fullPath = `${fnName}/${this.action}`;
	this.ROUTES = {} ;
	this.absolutePath = null ;
}

BaseCloud.prototype = {
	
	/**
	 * 动态修改配置参数
	 */
	setConfigs:function( config = {} ){
		var configs = JSON.parse(JSON.stringify(Config)) ;
		baseObject.deepMerge(configs , config) ;
		delete configs.inters ;
		this.configs = configs ;
		if (this.uniID) {
			this.uniID.init(configs.uniId);
		}
		Object.freeze(this.configs);
	},
	
	/**
	 * 执行全局拦截器
	 */
	globalInters : async function() {
		if (!this.isObject(Config.inters)) return;
		this.log("Interceptors:");
		for (var interName in Config.inters) {
			var inter = Config.inters[interName] ;
			if (this.isObject(inter)) {
				var isHit = isHandle( inter , this.fullPath );
				if (!isHit) {
					this.log("拦截器未命中：", interName , " ===> " , this.fullPath );
					continue ;
				}
				inter = inter.invoke ;
			}
			if (!this.isFn(inter)) {
				throw `拦截器${interName}拦截函数配置错误` ;
			}
			this.log(`  ${interName}()`);
			this.BREAK = true ;
			this.invokeInter = inter ;
			var interRes = await this.invokeInter(this.ATTRS || {} );
			if ( this.BREAK ) {
				this.log("请求被拦截：" , interName , " ===> " , this.fullPath );
				return interRes ;
			}
		}
	} ,
	
	/**
	 * 配置拦截器拦截规则
	 */
	setInters:function( config = {} ){
		if ( this.isEmptyObject(Config.inters) || this.isEmptyObject(config) ) {
			return ;
		}
		for (let interName in config) {
			var interObj = Config.inters[interName] ;
			var invoke = this.isObject(interObj) ? interObj.invoke : interObj ;
			if ( !this.isFn(invoke) ) {
				throw ` 云函数 ‘${this.fnName}’ 配置的拦截器：${interName} 未在公共模块 common > base-cloud > config.js > inters 中注册或配置错误` ;
			}
			var curInterObj = {} ;
			curInterObj[interName] = { 
				...config[interName] ,
				invoke
			};
			Object.assign( Config.inters , curInterObj );
		}
	},
	
	/**
	 * 自定义访问路由
	 */
	setRoutes:function(routes={}){
		this.ROUTES = routes ;
	},
	
	invoke: async function(absolutePath , isForward ) {
		this.absolutePath = absolutePath ;
		var action = this.ROUTES[this.action] || this.action ;
		var fn = getFunction(absolutePath , action);
		if (typeof fn != 'function') {
			return fn ;
		}
		if (isForward !== true ) {
			//全局拦截器
			var interRes = await this.globalInters();
			if ( this.BREAK ) {
				return baseResponse.getResponse( interRes , this.configs , this.getAttr("uniIdToken") );
			}
		}
		this.invokeAction = fn ;
		try{
			return baseResponse.getResponse( await this.invokeAction( this.ATTRS || {}) , this.configs , this.getAttr("uniIdToken") );
		}catch(e){
			console.error(e) ;
			return {
				state : "systemError" ,
				msg : e.message 
			}
		}
	},
	
	forward : async function(actionObj , paramsObj){
		var action = this.isObject(actionObj) ? actionObj.action : actionObj ; 
		if (!action) {
			throw "未定义请求转发的action参数" ;
		}
		this.action = action ;
		this.fullPath = `${this.fnName}/${this.action}` ;
		var curParams = this.isObject(actionObj) ? actionObj.params : paramsObj ;
		this.params = curParams || this.params ;
		this.log( "请求已转发至：" ,  this.fullPath );
		
		var action = this.ROUTES[this.action] || this.action ;
		var fn = getFunction( this.absolutePath , action);
		if (typeof fn != 'function') {
			return fn ;
		}
		this.forwardAction = fn ;
		try{
			return baseResponse.getResponse(await this.forwardAction( this.ATTRS || {}) , this.configs , this.getAttr("uniIdToken") );
		}catch(e){
			console.error(e) ;
			return {
				state : "systemError" ,
				msg : e.message 
			}
		}
	},
	
	// renderHtml:function( htmlPath , headers = {}){
	// 	var html = fs.readFileSync( htmlPath , 'utf-8');
	// 	headers['content-type'] = `text/html;charset:utf-8;` ;
	// 	return render( html , headers);
	// },
	
	// renderJs : function( jsStr , headers = {} ){
	// 	headers['content-type'] = 'application/javascript' ;
	// 	return render(jsStr , headers);
	// },
	
	next : function(e){
		this.BREAK = false ;
	},
	
	setAttr : function(obj){
		if (!this.isObject(obj)) {
			return ;
		}
		this.ATTRS = Object.assign(this.ATTRS || {} , obj );
	},
	
	getAttr : function(key){
		var attr = this.ATTRS || {} ;
		return attr[key] ;
	},

	log:function(){
		if (this.configs.isDebug) {
		   console.log(...arguments);
		}
	} ,
	
	/**
	 * 验证token
	 */
	checkToken : async function(){
		return await baseToken.checkToken( this.event.uniIdToken , this.configs.uniId );
	},
	
	/**
	 * 创建token
	 * @param {String} uid
	 */
	createToken : function(uid){
		return baseToken.createToken( uid , this.configs.uniId ) ;
	},
	...baseCrypto ,
	...baseMath ,
	...baseParams ,
	...baseObject ,
	...baseType ,
	...baseDatabase ,
	...baseResponse ,
	...jwt ,
	DateKit 
};

module.exports = BaseCloud ;
