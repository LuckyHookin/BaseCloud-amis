/**
 * @description For the convenience of updating the version, do not modify this file
 */
import MD5 from "./md5.js" ;
const mobileReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
var emailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
var amountReg = /^[0-9]{1}[0-9]*([.]{1}[0-9]{1,2})?$/;
var countReg = /^\d+$/;

var LOCAL_CACHE = {} ;
function call({ url, data = {}, success, fail, complete , requestFail , debug , cacheKey , cacheSpace , keepStr = false , keepKeys }) {
	url = setParamsToData(url, data);
	if (!keepStr) {
		dealDataByType( data , keepKeys );
	}
	var { name, action } = getNameAction(url);
	if (isDebug(debug) ) {
		console.log("");
		console.log("request >>>>>>>>>>>>>>>>");
		console.log(`开始请求，云函数：${name}，参数：`) ;
		console.log(JSON.stringify({
			"action": action,
			"params": data,
			"uniIdToken":uni.getStorageSync("uniIdToken")
		}));
		console.log( data );
		console.log("request >>>>>>>>>>>>>>>>");
		console.log("");
	}
	uniCloud.callFunction({
		name: name,
		data: {
			action: action,
			params: data
		},
		success: (e) => {
			var data = e.result;
			if (judge.isObject(data) && data.uniIdToken ) {
				uni.setStorageSync('uniIdToken', data.uniIdToken)
				if (data.tokenExpired) {
					uni.setStorageSync('uni_id_token_expired', data.tokenExpired)
				}
			}
			if (isDebug(debug) ) {
				console.log("");
				console.log("response <<<<<<<<<<<<<<<");
				console.log( "http请求成功：" + url + " -> requestId:" , e.requestId);
				console.log("响应结果为：" , data );
				console.log("response <<<<<<<<<<<<<<<");
				console.log("");
			}
			if (cacheKey && cacheSpace) {
				setCache(cacheSpace , cacheKey , data );
			}
			callSuccess(data, success, fail);
			if (typeof complete == 'function') {
				complete(data);
			}
		},
		fail: (e) => {
			if ( isDebug(debug) ) {
				console.log("http请求失败：" + url );
				console.log(e);
			}
			if (typeof requestFail == 'function') {
				requestFail(e);
			}else{
				uni.hideLoading();
				uni.stopPullDownRefresh();
				uni.showToast({
					title: '请求失败',
					icon: 'none'
				});
			}
			if (typeof complete == 'function') {
				complete(e);
			}
		}
	});
}

function callInCache({url , data , success , fail , complete , debug , keepStr = false , keepKeys}){
	var cacheSpace = MD5.md5(url) ;
	var cacheKey = MD5.md5(url + JSON.stringify(data)) ;
	var dataInCache = getCache(cacheSpace , cacheKey) ;
	if ( dataInCache && (!dataInCache.state || dataInCache.state == 'ok') ) {
		if ( isDebug(debug) ) {
			console.log("找到本地缓存数据，已停止请求服务端:" + url );
		}
		if (typeof complete == 'function') {
			complete(data);
		}
		if (typeof success == 'function') {
			success(dataInCache);
			return ;
		}
		return ;
	}
	call({ url , data , success , fail , complete , cacheKey , cacheSpace , debug , keepStr , keepKeys });
}

function isDebug(debug){
	return ( getApp().globalData.debug === true || debug ) &&  process.env.NODE_ENV === 'development' ;
}

function getCache(space , key){
	var cacheSpace = LOCAL_CACHE[space] ;
	if (!cacheSpace) {
		return ;
	}
	var cacheValue = cacheSpace[key] ;
	if (isNull(cacheValue)) {
		return cacheValue ;
	}
	return JSON.parse( JSON.stringify(cacheValue) ) ;
}

function setCache(space , key , value ){
	if (isNull(value)) {
		return ;
	}
	var cacheSpace = LOCAL_CACHE[space] ;
	if (!cacheSpace) {
		LOCAL_CACHE[space] = {} ;
	}
	LOCAL_CACHE[space][key] = JSON.parse( JSON.stringify(value) ) ;
}

function clearCache(url){
	if (!url) {
		LOCAL_CACHE = {} ;
		return ;
	}
	var urls = url.split(";") ;
	urls.forEach(item=>{
		var cacheSpace = MD5.md5(item);
		delete LOCAL_CACHE[cacheSpace] ;
	})
}

function callSuccess(data, success, fail) {
	if (data.state == 'needLogin') {
		clearStorage();
		// #ifdef H5
		var href = getPageRoute();
		uni.setStorageSync("beforeLoginPage", href);
		// #endif
		uni.navigateTo({
			url: "/pages/login/login"
		});
		return;
	}
	if (data.state == "noAuth") {
		uni.showModal({
			title: '提示',
			content: '无操作权限,请联系管理员',
			confirmColor: '#5d83f7',
			showCancel: false,
			success: function(e) {
				var firstSubPages = getFirstSubMenuPages();
				if (!!firstSubPages) {
					uni.redirectTo({
						url: firstSubPages
					});
					return ;
				}
				clearStorage();
				uni.reLaunch({
					url: "/pages/login/login"
				});
			}
		});
		return;
	}
	
	if (!data.state || data.state == 'ok') {
		if (typeof success == 'function') {
			success(data);
			return;
		}
		return;
	}
	if (typeof fail == 'function') {
		fail(data);
		return;
	}
	var msg = data.msg ;
	if (msg.length < 15) {
		uni.showToast({
			title: data.msg,
			icon: 'none' ,
			duration: msg.length > 7 ? 3000 : 2000
		});
		return ;
	}
	uni.showModal({
		title:'提示',
		content: msg ,
		showCancel:false,
		confirmColor:'#07c160'
	});
}

function getFirstSubMenuPages() {
	var menuList = uni.getStorageSync("menuList") || [];
	for (var i = 0; i < menuList.length; i++) {
		var cur = menuList[i];
		if (cur.type == 1) {
			var subUrl = getSubPagesByPid(cur._id);
			if (!!subUrl) {
				return subUrl;
			}
		}
	}
}

function getSubPagesByPid(pid) {
	var menuList = uni.getStorageSync("menuList") || [];
	for (var i = 0; i < menuList.length; i++) {
		var cur = menuList[i];
		if (cur.parentId == pid && cur.type == 2 && cur.pages.indexOf("/pages") == 0 ) {
			return cur.pages;
		}
	}
}

function clearStorage(e) {
	uni.removeStorageSync("uniIdToken");
	uni.removeStorageSync("uni_id_token_expired");
	uni.removeStorageSync("menuList");
	uni.removeStorageSync("admin");
	uni.removeStorageSync("beforeLoginPage");
	LOCAL_CACHE = {} ;
}

function getPageRoute(e) {
	/*获取当前路由*/
	var pages = getCurrentPages();
	let curPage = pages[pages.length - 1];
	if (!curPage) {
		return location.href.split("#")[1];
	}
	var route = "/" + curPage.route;
	//在微信小程序或是app中，通过curPage.options；如果是H5，则需要curPage.$route.query（H5中的curPage.options为undefined）
	let curParam = curPage.options || curPage.$route.query;
	var params = toParams(curParam);
	return params ? route + "?" + params : route;
}

function toParams(jsonData , filterKeys){
	var params = [] ;
	for(var key in jsonData){
		if (!!filterKeys && filterKeys.indexOf(key) > -1) {
			continue ;
		}
		var value = jsonData[key] ;
		value = value == 'null' || value == null ? '' : value ;
		params.push(key + "=" + value);
	}
	return params.join('&');
}

function getNameAction(url) {
	var index = url.indexOf("/");
	return {
		name: index == -1 ? url : url.substr(0, index),
		action: index == -1 ? "" : url.substr(index + 1)
	}
}

function isNull(obj) {
	return obj !== 0 && obj !== false && !obj;
}

function multiply(yuan,digit){
    var m=0, s1=yuan.toString(), s2=digit.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}

function setParamsToData(url, data) {
	if (url.indexOf("?") == -1) return url;
	var arr = url.split("?");
	url = arr[0];
	var params = arr[1];
	var pArr = params.split("&");
	for (var i = 0; i < pArr.length; i++) {
		var kv = pArr[i];
		var kvArr = kv.split("=");
		if (kvArr.length != 2) {
			continue;
		}
		var val = kvArr[1];
		data[kvArr[0]] = isNull(val) ? "" : val;
	}
	return url;
}

function dealDataByType(data , keepKeys) {
	var keeps = keepKeys ? keepKeys.split(",") : [] ;
	for (var key in data) {
		if ( keeps.indexOf(key) > -1) {
			continue ;
		}
		var value = data[key];
		if (isNull(value)) {
			data[key] = "";
			continue;
		}
		if ( value === 'true' || value === true || value === 'false' || value === false ) {
			data[key] = value === 'true' || value === true ;
			continue;
		}
		if ( judge.isArrayString( value ) || judge.isJsonString( value ) ) {
			data[key] = JSON.parse(value) ;
			continue ;
		}
		if ( isNumber(value) ) {
			data[key] = Number(value);
		}
	}
}

function validIdCard(sIdCard){
	sIdCard= sIdCard.replace(/^\s+|\s+$/g,"");//去除字符串的前后空格，允许用户不小心输入前后空格
	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	if (!reg.test(sIdCard)) {//判断是否全为18或15位数字，最后一位可以是大小写字母X
		uni.showToast({
			title: '身份证号码须为18位或15位数字',
			icon : 'none'
		});
		return false;
	}else if (sIdCard.length==18) {
		if (CheckIdCard.province(sIdCard)&&CheckIdCard.brithday18(sIdCard)&&CheckIdCard.validate(sIdCard)) {
			
		}else{
			uni.showToast({
				title: '请输入有效的身份证号码',
				icon : 'none'
			});
			return false;
		};
	}else if (sIdCard.length==15) {
		if (CheckIdCard.province(sIdCard)&&CheckIdCard.brithday15(sIdCard)) {
		}else{
			uni.showToast({
				title: '请输入有效的身份证号码',
				icon : 'none'
			});
			return false;
		};
	};
	return true;
}

var CheckIdCard={
	//Wi 加权因子 Xi 余数0~10对应的校验码 Pi省份代码  
	Wi:[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2],
	Xi:[1,0,"X",9,8,7,6,5,4,3,2],
	Pi:[11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,41,42,43,44,45,46,50,51,52,53,54,61,62,63,64,65,71,81,82,91],

	//检验18位身份证号码出生日期是否有效  
	//parseFloat过滤前导零，年份必需大于等于1900且小于等于当前年份，用Date()对象判断日期是否有效。  
	brithday18:function(sIdCard){
		var year=parseFloat(sIdCard.substr(6,4));
		var month=parseFloat(sIdCard.substr(10,2));
		var day=parseFloat(sIdCard.substr(12,2));
		var checkDay=new Date(year,month-1,day);
		var nowDay=new Date();
		if (1900<=year && year<=nowDay.getFullYear() && month==(checkDay.getMonth()+1) && day==checkDay.getDate()) {
			return true;
		}
	},

	//检验15位身份证号码出生日期是否有效  
	brithday15:function(sIdCard){
		var year=parseFloat(sIdCard.substr(6,2));
		var month=parseFloat(sIdCard.substr(8,2));
		var day=parseFloat(sIdCard.substr(10,2));
		var checkDay=new Date(year,month-1,day);
		if (month==(checkDay.getMonth()+1) && day==checkDay.getDate()) {
			return true;
		}
	},

	//检验校验码是否有效  
	validate:function(sIdCard){
		var aIdCard=sIdCard.split("");
		var sum=0;
		for (var i = 0; i < CheckIdCard.Wi.length; i++) {
			sum+=CheckIdCard.Wi[i]*aIdCard[i]; //线性加权求和  
		}
		var index=sum%11;//求模，可能为0~10,可求对应的校验码是否于身份证的校验码匹配  
		if (CheckIdCard.Xi[index]==aIdCard[17].toUpperCase()) {
			return true;
		}
	},

	//检验输入的省份编码是否有效  
	province:function(sIdCard){
		var p2=sIdCard.substr(0,2);
		for (var i = 0; i < CheckIdCard.Pi.length; i++) {
			if(CheckIdCard.Pi[i]==p2){
				return true;
			}
		}
	}
};

function check(e){
	var data = e.detail.value ;
	var res = {
		fail : true ,
		data 
	};
	var finalData = {} ;
	for( var key in data ){
		var value = data[key] ;
		var arr = key.split("|") ;
		var name = arr[0] ;
		finalData[name] = value ;
		data[key] = value ;
		
		if (arr.length == 1) {
			continue ;
		}
		
		var canEmpty = arr[arr.length-1] == "empty" ;
		if (canEmpty && !value) {
			continue ;
		}
		
		var znName = arr[1] ; //表单名称
		if (!value && !!znName) {
			var prefix = "请输入" ;
			if (znName.indexOf("请选择") > -1) {
				prefix = "请选择" ;
				znName = znName.replace("请选择","");
			}
			if (znName.indexOf("请上传") > -1) {
				prefix = "请上传" ;
				znName = znName.replace("请上传","");
			}
			uni.showToast({
				title: prefix + znName ,
				icon : 'none'
			});
			return res ;
		}
		
		if (arr.length == 2) {
			continue ;
		}
		
		var rule = arr[2] ;
		if ( isNumber(rule) && value.length != Number(rule) ) {
			uni.showToast({
				title: znName + '长度为' + rule ,
				icon : 'none'
			});
			return res ;
		}
		if ( rule.indexOf("~") > -1 ) { //区间标识
			var sectionArr = rule.split("~") ;
			var min = sectionArr[0] ;
			var max = sectionArr[1] ;
			if (value.length < min) {
				uni.showToast({
					title: znName + '最少' + min + "个字符",
					icon : 'none'
				});
				return res ;
			}
			if (value.length > max) {
				uni.showToast({
					title: znName + '最多' + max + "个字符",
					icon : 'none'
				});
				return res ;
			}
		}
		
		switch ( rule ){
			
			case 'mobile':
				if ( !mobileReg.test(value) ) { 
					uni.showToast({
						title: znName + '不正确',
						icon : 'none'
					});
					return res; 
				}
			break;
			
			case 'amount':
				if ( value != 0 && !amountReg.test(value) ) { 
					uni.showToast({
						title: znName + '不正确',
						icon : 'none'
					});
					return res ; 
				}
			break;
			
			case 'count':
				if ( !countReg.test(value) ) { 
					uni.showToast({
						title: znName + '不正确',
						icon : 'none'
					});
					return res; 
				}
			break;
			
			case 'email':
				if (emailReg.test(value) == false ) {
					uni.showToast({
						title: znName + "不正确",
						icon : 'none'
					});
					return res ;
				}
			break;
			
			case 'idcard':
				if ( validIdCard(value) == false ) {
					return res ;
				}
			break;
		}
	}
	
	return { fail : false , data : finalData } ;
}

function isNumber(num){
	return !Array.isArray(num) && num !== false && num !== true && !isNaN(Number(num)) ;
}

function redirectTo( url , isRefresh , backPath){
	if(backPath){
		goBack(backPath);
		return  ;
	}
	if (isRefresh) {
		uni.redirectTo({
			url: url
		});
		return ;
	}
	uni.navigateTo({
		url: url 
	});
}

//返回历史页面
function goBack( defaultPage , delta = 1 , title){
	var pageList = getCurrentPages();
	if (pageList.length <= delta) {
		defaultPage = defaultPage || "/pages/login/login" ;
		uni.navigateTo({
			url: defaultPage 
		});
	}else{
		uni.navigateBack({
			delta: delta
		});
	}
	if (title) {
		setTimeout(e => {
			uni.showToast({
				title: title ,
				icon : 'success'
			});
		},200);
	}
}

function goSuccessBack( defaultPage , title = '保存成功' ){
	goBack( defaultPage , 1 , title);
}

function dealResult(res , dataset , success , fail , complete , data){
	uni.hideLoading();
	var backPath = dataset.back ;
	var isRefresh = !dataset.redirect && !backPath ;
	var rediretPath = dataset.rediret || getPageRoute() ;
	var clear = dataset.clear ;
	if ( !res.state || res.state == "ok") {
		if (!!clear) {
			clearCache(clear);
		}
		if (typeof success == "function") {
			success(res , data );
			return ;
		}
		var alert = dataset.alert ;
		if (!!alert) {
			uni.showModal({
				title:'提示',
				content: Boolean(alert) === true ? res.msg : alert ,
				showCancel:false,
				confirmColor:"#07c160",
				success : (e) => {
					redirectTo( rediretPath , isRefresh , backPath);
				}
			});
			return ;
		}
		redirectTo( rediretPath , isRefresh , backPath);
		return ;
	}
	if (typeof fail == "function") {
		fail(res , data );
		return ;
	}
	uni.showToast({
		title: res.msg ,
		icon : 'none'
	});
}

function submit( e , success , fail , complete){
	var data = e.detail.value ;
	var dataset = e.currentTarget.dataset ;
	var confirmContent = dataset.confirm ;
	var checkRes = check(e);
	if ( checkRes.fail ) {
		if (judge.isFn(complete)) {
			complete(checkRes);
		}
		return ;
	}
	if (!!confirmContent) {
		uni.showModal({
			title:'提示',
			content: confirmContent ,
			showCancel:true,
			confirmColor:'#07c160',
			success : (e)=>{
				if (e.confirm) {
					submitData( dataset , checkRes.data , success , fail , complete);
				}
			}
		});
		return ;
	}
	submitData( dataset , checkRes.data , success , fail , complete);
}

function submitData( dataset , data , success , fail , complete){
	if (!dataset.action) {
		console.error("form组件未定义data-action属性");
		return ;
	}
	uni.showLoading({
		title:"请稍后…",
		mask: true 
	});
	call({
		keepStr : dataset.keepstr ,
		keepKeys : dataset.keepkeys ,
		url : dataset.action ,
		data : data ,
		success : res =>{
			dealResult(res , dataset , success , fail , complete , data);
		},
		fail : res =>{
			dealResult(res , dataset , success , fail , complete, data);
		},
		complete
	});
}

function bindEnter(vm,functionname,type) {
	// #ifdef H5
	document.onkeydown = function(e) {
		var key = window.event.keyCode;
		if (key == 13) {
			// window.event.preventDefault(); //关闭浏览器快捷键
			vm[functionname](type);
		}
	};
	// #endif
}

function unbindEnter(){
	document.onkeydown = function(e){}
}

function sign(e){
	return MD5.md5(e).toUpperCase() ;
}

const DateKit = {
	
	getWeekName : function(date = new Date()){
		 var weekday=["周日","周一","周二","周三","周四","周五","周六"];
		 return weekday[date.getDay()] ;
	},
		
	addMinutes:function(minutes , date){
		date = date || this.now() ;
		return date + minutes * 60 * 1000 ;
	},

	addHours:function(hours , date){
		date = date || this.now() ;
		return date + hours * 60 * 60 * 1000 ;
	},

	addDays:function(days=0 , date){
		date = date || this.now() ;
		return date + days * 24 * 60 * 60 * 1000 ;
	},

	addMonths:function(months=0 , date){
		date = new Date(date || this.now()) ;
		date.setMonth(date.getMonth() + months );
		return date.getTime() ;
	},

	formatMinNum :function (num){
		return num > 9 ? num : "0" + num ;
	},

	/**
	 * @param timeStr 日期类型的字符串
	 */
	parse:function(timeStr){
		var timestamp = Date.parse(timeStr);
		if (isNaN(timestamp)) {
			return null ;
		}
		return timestamp ;
	},

	toStr:function( timestamp , fileds ){
		if(!timestamp){
			return '' ;
		}
		//兼容10位数的时间戳
		if ( (timestamp+"").length == 10) {
			timestamp = timestamp * 1000 ;
		}
		var now = new Date(parseFloat(timestamp));
		var year = now.getFullYear();
		var month = this.formatMinNum(now.getMonth() + 1);
		var date = this.formatMinNum(now.getDate());
		var hour = this.formatMinNum(now.getHours());
		var minute = this.formatMinNum(now.getMinutes());
		var second = this.formatMinNum(now.getSeconds());
		if (fileds == 'seconds') {
			return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
		}
		if (fileds == 'minute') {
			return `${year}-${month}-${date} ${hour}:${minute}`;
		}
		if (fileds == 'hour') {
			return `${year}-${month}-${date} ${hour}:00`;
		}
		if (fileds == 'day') {
			return `${year}-${month}-${date}`;
		}
		if (fileds == 'month') {
			return `${year}-${month}`;
		}
		if (fileds == 'year') {
			return `${year}年`;
		}
		return `${year}-${month}-${date} ${hour}:${minute}`;
	},

	/**
	 * @param time 毫秒数
	 * @return 入参时间距离当前时间的时间
	 */
	friendlyDate: function(time) {
		let ms = time - Date.now() ;
		let num ;
		let quantifier ;
		let suffix = '后'
		if (ms < 0) {
			suffix = '前'
			ms = -ms ;
		}
		const seconds = Math.floor((ms) / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const months = Math.floor(days / 30);
		const years = Math.floor(months / 12);
		switch (true) {
			case years > 0:
				num = years;
				quantifier = '年';
				break;
			case months > 0:
				num = months;
				quantifier = '月';
				break;
			case days > 0:
				num = days;
				quantifier = '天';
				break;
			case hours > 0:
				num = hours;
				quantifier = '小时';
				break;
			case minutes > 0:
				num = minutes;
				quantifier = '分钟';
				break;
			default:
				num = seconds;
				quantifier = '秒';
				break;
		}
		return `${num}${quantifier}${suffix}`;
	},
}

const judge = {
	
	isJsonString : function(obj){
		if ( isNull(obj) ) {
			return false ;
		}
		if (!this.isString(obj)) {
			return false ;
		}
		try{
			var jsonObj = JSON.parse(obj) ;
			return this.isObject(jsonObj) ;
		}catch(e){
			return false ;
		}
	},
	
	isArrayString : function(obj){
		if ( isNull(obj) ) {
			return false ;
		}
		if (!this.isString(obj)) {
			return false ;
		}
		try{
			var arr = JSON.parse(obj) ;
			return this.isArray(arr) ;
		}catch(e){
			return false ;
		}
	},
	
	isObject : function (obj) {
	  return Object.prototype.toString.call(obj) === '[object Object]'
	},
	
	isEmptyObject:function(obj){
		return this.isObject(obj) && Object.keys(obj).length == 0 ;
	},
	
	isFn : function(fn){
		return typeof fn == "function" ;
	},
	
	isArray:function(arr){
		return Array.isArray(arr);
	},
	
	isString : function(obj){
		return  Object.prototype.toString.call(obj) === '[object String]' ;
	},
	
	isDate:function(obj){
		return Object.prototype.toString.call(obj) === '[object Date]' ;
	},
	
	isReg:function(obj){
		return Object.prototype.toString.call(obj) === '[object RegExp]' ;
	}
};

// 防抖
var debounceTimeout = null ;
function debounce(fn, wait = 500) {    
   if(debounceTimeout !== null)   clearTimeout(debounceTimeout);
   debounceTimeout = setTimeout(fn, wait);
}

export default {
	...judge,
	debounce  ,
	multiply  ,
	date : DateKit ,
	sign ,
	call ,
	callInCache ,
	clearCache ,
	isNull ,
	clearStorage ,
	getFirstSubMenuPages ,
	getPageRoute ,
	validIdCard ,
	checkData : check ,
	submit ,
	goBack ,
	goSuccessBack ,
	unbindEnter ,
	bindEnter ,
	isNumber
}