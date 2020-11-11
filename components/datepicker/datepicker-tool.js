export default {
	/**
	 * 获取公历节日
	 * @param date Date对象
	 */
	getHoliday(date) {
		let holidays = {
			'0101': '元旦',
			'0214': '情人',
			'0308': '妇女',
			'0312': '植树',
			'0401': '愚人',
			'0501': '劳动',
			'0504': '青年',
			'0601': '儿童',
			'0701': '建党',
			'0801': '建军',
			'0903': '抗日',
			'0910': '教师',
			'1001': '国庆',
			'1031': '万圣',
			'1224': '平安',
			'1225': '圣诞'
		};
		let value = this.format(date, 'mmdd');
		if (holidays[value]) return holidays[value];
		return false;
	},
	/**
	 * 解析标准日期格式
	 * @param s 日期字符串
	 * @return 返回Date对象
	 */
	parse: s => new Date(s.replace(/(年|月|-)/g, '/').replace(/(日)/g, '')),
	/**
	 * 比较日期是否为同一天
	 * @param a Date对象
	 * @param b Date对象
	 * @return Boolean
	 */
	isSameDay: (a, b) => a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear() && a.getDate() == b.getDate(),
	/**
	 * 格式化Date对象
	 * @param d 日期对象
	 * @param f 格式字符串
	 * @return 返回格式化后的字符串
	 */
	format(d, f) {
		var o = {
			"m+": d.getMonth() + 1,
			"d+": d.getDate(),
			"h+": d.getHours(),
			"i+": d.getMinutes(),
			"s+": d.getSeconds(),
			"q+": Math.floor((d.getMonth() + 3) / 3),
		};
		if (/(y+)/.test(f))
			f = f.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(f))
				f = f.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return f;
	},
	/**
	 * 用于format格式化后的反解析
	 * @param s 日期字符串
	 * @param f 格式字符串
	 * @return 返回Date对象
	 */
	inverse(s, f) {
		var o = {
			"y": '',
			"m": '',
			"d": '',
			"h": '',
			"i": '',
			"s": '',
		};
		let d = new Date();
		if (s.length != f.length) return d;
		for (let i in f)
			if (o[f[i]] != undefined) o[f[i]] += s[i];
		if (o.y) d.setFullYear(o.y.length < 4 ? (d.getFullYear() + '').substr(0, 4 - o.y.length) + o.y : o.y);
		o.m && d.setMonth(o.m - 1, 1);
		o.d && d.setDate(o.d - 0);
		o.h && d.setHours(o.h - 0);
		o.i && d.setMinutes(o.i - 0);
		o.s && d.setSeconds(o.s - 0);
		return d;
	},
	/**
	 * 获取日历数组（42天）
	 * @param date 日期对象或日期字符串
	 * @param proc 处理日历(和forEach类似)，传递一个数组中的item
	 * @return Array
	 */
	getCalendar(date, proc) {
		let it = new Date(date),
			calendars = [];
		it.setDate(1);
		it.setDate(it.getDate() - ((it.getDay() == 0 ? 7 : it.getDay()) - 1)); //偏移量
		for (let i = 0; i < 42; i++) {
			let tmp = {
				dateObj: new Date(it),
				title: it.getDate(),
				isOtherMonth: it.getMonth() < date.getMonth() || it.getMonth() > date.getMonth()
			};
			calendars.push(Object.assign(tmp, proc ? proc(tmp) : {}));
			it.setDate(it.getDate() + 1);
		}
		return calendars;
	},
	/**
	 * 获取日期到指定的月份1号(不改变原来的date对象)
	 * @param d Date对象
	 * @param v 指定的月份
	 * @return Date对象
	 */
	getDateToMonth(d, v) {
		let n = new Date(d);
		n.setMonth(v, 1);
		return n;
	},
	/**
	 * 把时间数组转为时间字符串
	 * @param t Array[时,分,秒]
	 * @param showSecinds 是否显示秒
	 * @return 字符串 时:分[:秒]
	 */
	formatTimeArray(t, s) {
		let r = [...t];
		if (!s) r.length = 2;
		r.forEach((v, k) => r[k] = ('0' + v).slice(-2));
		return r.join(':');
	}
};
