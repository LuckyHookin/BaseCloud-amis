/**
 * @description For the convenience of updating the version, do not modify this file
 */
module.exports = {
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
	
	now:function(timestamp){
		timestamp = timestamp || Date.now();
		return timestamp + 8 * 60 * 60 * 1000 ;
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
	}
}