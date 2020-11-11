<template>
	<view class="datepicker base-cloud" :tabindex="0" @focus="focus" @blur="blur">
		
		<labels :title="title" :titleWidth="titleWidth" :isTop="isTop" :isVertical="isVertical" :noPadding="noPadding">
			<view class="father">
				<view class="rds2 bd hover fixAutoNoPd middle pl10 w100p hidden" style="height: 38px;" id="dateBox" @tap.stop="switchShow">
					<view>
						<text class="gray" v-if="!result.startTime">{{placeholder}}</text>
						<input class="fz12" :disabled="true" :value="`${result.startTime}${result.endTime?' ~ ' + result.endTime : ''}`" type="text" v-else>
					</view>
					<view v-if="result.startTime" class="ml5 bIcon-close fz12 gray w25 text-center whiteBg" @tap.stop="clearValue"></view>
					<view v-else-if="showIcon" class="ml5 bIcon-calendar fz12 gray w25 text-center whiteBg"></view>
				</view>
				<view class="father" style="user-select: none;">
					<view v-if="isShow" class="abs z11 top w310 h370 whiteBg rds5 top5" :class="isRight?'right':'left'">
						<!-- 日期选择器 -->
						<view v-if="type!='time'" :class="{op0 : showTimePicker}" class="whiteBg shadow abs left top bd rds5">
							<view class="fz16 text-center flex ptb8 plr20">
								<view class="bIcon-left fz12 bold hover" @click="onSetYear('-1')"></view>
								<view class="bIcon-arrowLeft fz12 hover bold" @click="onSetMonth('-1')"></view>
								<text class="plr30 main bold">{{calendarTitle}}</text>
								<view class="bIcon-arrowRight fz12 hover bold" @click="onSetMonth('+1')"></view>
								<view class="bIcon-right fz12 bold hover" @click="onSetYear('+1')"></view>
							</view>
							<swiper class="w310 h280" :disable-touch="true" :circular="true" :duration="200" :skip-hidden-item-layout="true" :current="calendarIndex" @change="onSwiperChange">
								<swiper-item class="picker-calendar pl8" v-for="(calendar,calendarIndex2) in calendars" :key="calendarIndex2">
									<view v-for="(week,index) in weeks" :key="index">
										<view class="w35 center-block">
											<view class="square">
												<view class="flex ct">
													{{week}}
												</view>
											</view>
										</view>
									</view>
										
									<view class="picker-calendar-view" v-for="(date,dateIndex) in calendar" @click="onSelectDate(date)">
										<!-- 背景样式 -->
										<view v-show="date.bgStyle.type" :class="'picker-calendar-view-'+date.bgStyle.type" :style="{background: date.bgStyle.background}"></view>
										<!-- 正常和选中样式 -->
										<view class="picker-calendar-view-item" :style="{opacity: date.statusStyle.opacity, color: date.statusStyle.color, background: date.statusStyle.background}">
											<text>{{date.title}}</text>
										</view>
										<!-- 小圆点样式 -->
										<view class="picker-calendar-view-dot" :style="{opacity: date.dotStyle.opacity, background: date.dotStyle.background}"></view>
										<!-- 信息样式 -->
										<view v-show="date.tips" class="picker-calendar-view-tips">{{date.tips}}</view>
									</view>
								</swiper-item>
							</swiper>
							<view class="pd10 flex">
								<view>
									<block v-if="isMultiSelect">
										<view class="grey flex lt">
											<text>{{beginText}}日期</text>
											<text class="ml5">{{BeginTitle}}</text>
											<view v-if="isContainTime" class="ml5 hover" 
											 :style="{color}" @click="onShowTimePicker('begin')">{{BeginTimeTitle}}</view>
										</view>
										<view class="grey flex lt">
											<text>{{endText}}日期</text>
											<text class="ml5">{{EndTitle}}</text>
											<view v-if="isContainTime" class="ml5 hover"
											 :style="{color}" @click="onShowTimePicker('end')">{{EndTimeTitle}}</view>
										</view>
									</block>
									<block v-else>
										<view class="grey flex lt">
											<text>当前选择</text>
											<text class="ml5">{{BeginTitle}}</text>
											<view v-if="isContainTime" class="ml5 hover"
											 :style="{color}" @click="onShowTimePicker('begin')">{{BeginTimeTitle}}</view>
										</view>
									</block>
								</view>
								<view class="flex rt">
									<view class="pr7 hover" @click="onCancel">取消</view>
									<view class="pl7 hover" :style="{color}" @click="onConfirm">确定</view>
								</view>
							</view>
						</view>
						<!-- 时间选择器 -->
						<view v-if="showTimePicker" class="abs z11 top left w310 h380 whiteBg rds5">
							<view class="abs bd shadow">
								<view class="pd text-center">
									<text class="main bold">请选择时间</text>
								</view>
								<picker-view class="text-center h280" style="line-height: 34px;" :value="timeValue" @change="onTimeChange">
									<picker-view-column>
										<view v-for="(v,i) in 24" :key="i">{{i<10?'0'+i:i}}时</view>
									</picker-view-column>
									<picker-view-column>
										<view v-for="(v,i) in 60" :key="i">{{i<10?'0'+i:i}}分</view>
									</picker-view-column>
									<picker-view-column v-if="showSeconds">
										<view v-for="(v,i) in 60" :key="i">{{i<10?'0'+i:i}}秒</view>
									</picker-view-column>
								</picker-view>
								<view class="flex pd">
									<view>
										<text>当前选择</text>
										<text class="ml5">{{PickerTimeTitle}}</text>
									</view>
									<view class="flex rt">
										<view class="plr7 hover" @click="onCancelTime">取消</view>
										<view class="plr7 hover" :style="{color}" @click="onConfirmTime">确定</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
		</labels>
		
		<input type="text" :name="name" :value="startTimeValue" class="none">
		<input type="text" :name="endName" :value="endTimeValue" class="none" v-if="endName">
	</view>
	
	
	
</template>

<script>
	import DatepickerTool from "./datepicker-tool.js" ;
	export default {
		name : "datepicker" ,
		model:{
			prop: "value",
			event: "bindModel"
		},
		props: {
			title : {
				default : ""
			},
			titleWidth : {
				default : 90
			},
			isTop:{
				default : false 
			},
			isVertical:{
				default : false 
			},
			noPadding: {
				type: Boolean,
				default: false
			},
			showIcon:{
				default : true 
			},
			name : {
				default : "" 
			},
			endName : {
				default : "" 
			},
			placeholder:{
				default : "请选择时间"
			},
			color: { //颜色
				type: String,
				default: '#07c160'
			},
			showSeconds: { //是否显示秒 针对type为datetime或time时生效
				type: Boolean,
				default: false
			},
			value: { //初始的值
				default : ""
			},
			endValue: { //初始的值
				default : ""
			},
			type: { //类型date time datetime range rangetime
				type: String,
				default: 'range'
			},
			format: { //初始格式
				type: String,
				default: ''
			},
			showHoliday: { //显示公历节日
				type: Boolean,
				default: true
			},
			showTips: { //显示提示
				type: Boolean,
				default: false
			},
			beginText: { //开始文案 针对type为范围选择时生效
				type: String,
				default: '开始'
			},
			endText: { //结束文案 针对type为范围选择时生效
				type: String,
				default: '结束'
			},
			valueType:{
				default : "string" //string , timestamp
			}
		},
		data() {
			return {
				show : false ,
				isFocus: false, //是否显示
				isShow: false, //是否显示
				isMultiSelect: false, //是否为多选
				isContainTime: false, //是否包含时间
				date: {}, //当前日期对象
				weeks: ["一", "二", "三", "四", "五", "六", "日"],
				calendarTitle: '初始化', //标题
				calendars: [[],[],[]], //日历数组
				calendarIndex: 1, //当前日历索引
				checkeds: [], //选中的日期对象集合
				showTimePicker: false, //是否显示时间选择器
				timeValue: [0, 0, 0], //时间选择器的值
				timeType: 'begin', //当前时间选择的类型
				beginTime: [0, 0, 0], //当前所选的开始时间值
				endTime: [0, 0, 0], //当前所选的结束时间值
				result : {} ,
				startTimeValue : "" ,
				endTimeValue : "" ,
				isRight : false 
			};
		},
		methods: {
			//设置值
			setValue(value) {
				this.date = new Date();
				this.checkeds = [];
				this.isMultiSelect = this.type.indexOf('range') >= 0;
				this.isContainTime = this.type.indexOf('time') >= 0;
				//将字符串解析为Date对象
				let parseDateStr = (str) => (this.format ? DatepickerTool.inverse(str, this.format) : DatepickerTool.parse(str));
				if (value) {
					if (this.isMultiSelect) {
						if(!Array.isArray(value)){
							value = (value+"").split(",") ;
						}
						if (Array.isArray(value)) {
							if ( value.length == 1  && this.endValue) {
								value.push(this.endValue) ;
							}
							var startVal = value[0] ;
							var endVal = value[1] ;
							if (!isNaN(Number(startVal)) && !isNaN(Number(endVal)) ) {
								startVal = this.type == 'range' ? this.bcc.date.toStr(startVal ,'day') : this.bcc.date.toStr(startVal , 'seconds') 
								endVal = this.type == 'range' ? this.bcc.date.toStr(endVal ,'day') : this.bcc.date.toStr(endVal , 'seconds') 
								value = [startVal , endVal]
							}
							this.startTimeValue = this.valueType == 'timestamp' ? Date.parse(startVal) : startVal ;
							this.endTimeValue = this.valueType == 'timestamp' ? Date.parse(endVal) : endVal ;
							this.result = { startTime : startVal , endTime : endVal };
							value.forEach((dateStr, index) => {
								let date = parseDateStr(dateStr);
								let time = [date.getHours(), date.getMinutes(), date.getSeconds()];
								if (index == 0) this.beginTime = time;
								else this.endTime = time;
								this.checkeds.push(date);
							});
						}
					} else {
						this.startTimeValue = this.valueType == 'timestamp' ? Date.parse(value) : value ;
						this.result = { startTime : value };
						if (this.type == 'time') {
							let date = parseDateStr('2019/1/1 ' + value);
							this.beginTime = [date.getHours(), date.getMinutes(), date.getSeconds()];
							this.onShowTimePicker('begin');
						} else {
							this.checkeds.push(parseDateStr(value));
							if (this.isContainTime) this.beginTime = [
								this.checkeds[0].getHours(),
								this.checkeds[0].getMinutes(),
								this.checkeds[0].getSeconds()
							];
						}
					}
					if (this.checkeds.length) this.date = new Date(this.checkeds[0]);
				} else {
					if (this.isContainTime) {
						this.beginTime = [this.date.getHours(), this.date.getMinutes(), this.date.getSeconds()];
						if (this.isMultiSelect) this.endTime = [...this.beginTime];
					}
					this.checkeds.push(new Date(this.date));
				}
				if (this.type != 'time') this.refreshCalendars(true);
				else this.onShowTimePicker('begin');
			},
			//改变年份
			onSetYear(value) {
				this.date.setFullYear(this.date.getFullYear() + parseInt(value));
				this.refreshCalendars(true);
			},
			//改变月份
			onSetMonth(value) {
				this.date.setMonth(this.date.getMonth() + parseInt(value));
				this.refreshCalendars(true);
			},
			//时间选择变更
			onTimeChange(e) {
				this.timeValue = e.detail.value;
			},
			//设置时间选择器的显示状态
			onShowTimePicker(type) {
				this.showTimePicker = true;
				this.timeType = type;
				this.timeValue = type == 'begin' ? [...this.beginTime] : [...this.endTime];
			},
			//处理日历
			procCalendar(item) {
				//定义初始样式
				item.statusStyle = {
					opacity: 1,
					color: item.isOtherMonth ? '#ddd' : '#000',
					background: 'transparent'
				};
				item.bgStyle = {
					type: '',
					background: 'transparent'
				};
				item.dotStyle = {
					opacity: 1,
					background: 'transparent'
				};
				item.tips = "";
				//标记今天的日期
				if (DatepickerTool.isSameDay(new Date(), item.dateObj)) {
					item.statusStyle.color = this.color;
					if (item.isOtherMonth) item.statusStyle.opacity = 0.3;
				}
				//标记选中项
				this.checkeds.forEach(date => {
					if (DatepickerTool.isSameDay(date, item.dateObj)) {
						item.statusStyle.background = this.color;
						item.statusStyle.color = '#fff';
						item.statusStyle.opacity = 1;
						if (this.isMultiSelect && this.showTips) item.tips = this.beginText;
					}
				});
				//节假日或今日的日期标点
				if (item.statusStyle.background != this.color) {
					let holiday = this.showHoliday ? DatepickerTool.getHoliday(item.dateObj) : false;
					if (holiday || DatepickerTool.isSameDay(new Date(), item.dateObj)) {
						item.title = holiday || item.title;
						item.dotStyle.background = this.color;
						if (item.isOtherMonth) item.dotStyle.opacity = 0.2;
					}
				} else {
					item.title = item.dateObj.getDate();
				}
				//有两个日期
				if (this.checkeds.length == 2) {
					if (DatepickerTool.isSameDay(this.checkeds[0], item.dateObj)) { //开始日期
						item.bgStyle.type = 'bgbegin';
					}
					if (DatepickerTool.isSameDay(this.checkeds[1], item.dateObj)) { //结束日期
						if (this.isMultiSelect && this.showTips) item.tips = item.bgStyle.type ? this.beginText + ' / ' + this.endText : this.endText;
						if (!item.bgStyle.type) { //开始日期不等于结束日期
							item.bgStyle.type = 'bgend';
						} else {
							item.bgStyle.type = '';
						}
					}
					if (!item.bgStyle.type && (+item.dateObj > +this.checkeds[0] && +item.dateObj < +this.checkeds[1])) { //中间的日期
						item.bgStyle.type = 'bg';
						item.statusStyle.color = this.color;
					}
					if (item.bgStyle.type) {
						item.bgStyle.background = this.color;
						item.dotStyle.opacity = 1;
						item.statusStyle.opacity = 1;
					}
				}
			},
			//刷新日历
			refreshCalendars(refresh = false) {
				let date = new Date(this.date);
				let before = DatepickerTool.getDateToMonth(date, date.getMonth() - 1);
				let after = DatepickerTool.getDateToMonth(date, date.getMonth() + 1);
				if (this.calendarIndex == 0) {
					if(refresh) this.calendars.splice(0, 1, DatepickerTool.getCalendar(date, this.procCalendar));
					this.calendars.splice(1, 1, DatepickerTool.getCalendar(after, this.procCalendar));
					this.calendars.splice(2, 1, DatepickerTool.getCalendar(before, this.procCalendar));
				} else if (this.calendarIndex == 1) {
					this.calendars.splice(0, 1, DatepickerTool.getCalendar(before, this.procCalendar));
					if(refresh) this.calendars.splice(1, 1, DatepickerTool.getCalendar(date, this.procCalendar));
					this.calendars.splice(2, 1, DatepickerTool.getCalendar(after, this.procCalendar));
				} else if (this.calendarIndex == 2) {
					this.calendars.splice(0, 1, DatepickerTool.getCalendar(after, this.procCalendar));
					this.calendars.splice(1, 1, DatepickerTool.getCalendar(before, this.procCalendar));
					if(refresh) this.calendars.splice(2, 1, DatepickerTool.getCalendar(date, this.procCalendar));
				}
				this.calendarTitle = DatepickerTool.format(this.date, 'yyyy年mm月');
			},
			//滑块切换
			onSwiperChange(e) {
				this.calendarIndex = e.detail.current;
				let calendar = this.calendars[this.calendarIndex];
				this.date = new Date(calendar[22].dateObj); //取中间一天，保证是当前的月份
				this.refreshCalendars();
			},
			//选中日期
			onSelectDate(date) {
				if (~this.type.indexOf('range') && this.checkeds.length == 2) this.checkeds = [];
				else if (!(~this.type.indexOf('range')) && this.checkeds.length) this.checkeds = [];
				this.checkeds.push(new Date(date.dateObj));
				this.checkeds.sort((a, b) => a - b); //从小到大排序
				this.calendars.forEach(calendar => {
					calendar.forEach(this.procCalendar); //重新处理
				});
			},
			//时间选择取消
			onCancelTime() {
				this.showTimePicker = false;
				this.type == 'time' && this.onCancel();
			},
			//时间选择确定
			onConfirmTime() {
				if (this.timeType == 'begin') this.beginTime = this.timeValue;
				else this.endTime = this.timeValue;
				this.showTimePicker = false;
				this.type == 'time' && this.onConfirm();
			},
			//取消
			onCancel() {
				this.isShow = false ;
				this.$emit('cancel', false);
			},
			//确定
			onConfirm() {
				let result = {
					value: null,
					date: null
				};
				//定义默认格式
				let defaultFormat = {
					'date': 'yyyy-mm-dd',
					'time': 'hh:ii' + (this.showSeconds ? ':ss' : ''),
					'datetime': ''
				};
				defaultFormat['datetime'] = defaultFormat.date + ' ' + defaultFormat.time;
				let fillTime = (date, timeArr) => {
					date.setHours(timeArr[0], timeArr[1]);
					if (this.showSeconds) date.setSeconds(timeArr[2]);
				};
				if (this.type == 'time') {
					let date = new Date();
					fillTime(date, this.beginTime);
					result.value = DatepickerTool.format(date, this.format ? this.format : defaultFormat.time);
					result.date = date;
				} else {
					if (this.isMultiSelect) {
						let values = [], dates = [];
						if (this.checkeds.length < 2) return uni.showToast({
							icon: 'none',
							title: '请选择两个日期'
						});
						this.checkeds.forEach((date, index) => {
							let newDate = new Date(date);
							if (this.isContainTime) {
								let time = [this.beginTime, this.endTime];
								fillTime(newDate, time[index]);
							}
							values.push(DatepickerTool.format(newDate, this.format ? this.format : defaultFormat[this.isContainTime ?
								'datetime' : 'date']));
							dates.push(newDate);
						});
						result.value = values;
						result.date = dates;
					} else {
						let newDate = new Date(this.checkeds[0]);
						if (this.isContainTime) {
							newDate.setHours(this.beginTime[0], this.beginTime[1]);
							if (this.showSeconds) newDate.setSeconds(this.beginTime[2]);
						}
						result.value = DatepickerTool.format(newDate, this.format ? this.format : defaultFormat[this.isContainTime ?
							'datetime' : 'date']);
						result.date = newDate;
					}
				}
				
				console.log(result);
				
				//处理返回的值
				if (this.type.indexOf('range') > -1) {
					var keys = ['startTime',"endTime"];
					for (var i = 0; i < result.value.length; i++) {
						var cur = result.value[i] ;
						if (!this.showSeconds && this.type == 'rangetime') {
							cur += `:${i==0?'00':'59'}`;
						}
						result[keys[i]] = cur ;
						if (this.valueType == 'timestamp' && this.type == 'range') {
							cur += i == 0 ? ' 00:00:00' : ' 23:59:59'
						}
						this[keys[i] + "Value"] = this.valueType == 'timestamp' ? Date.parse(cur) : cur ;
					}
					this.$emit('bindModel' , result.value );
				}else{
					var value = result.value ;
					if (!this.showSeconds && this.type == 'datetime' ) {
						value += ":00" ;
					}
					this.startTimeValue = this.valueType == 'timestamp' ? Date.parse(value) : value ;
					result.startTime = value ;
					this.$emit('bindModel' , value );
				}
				this.result = result ;
				this.isShow = false ;
				this.$emit('confirm', result);
			},
			clearValue:function(e){
				this.result = {} ;
				this.startTimeValue = '' ;
				this.startTime = '' ;
				this.$emit('bindModel' , '' );
				this.$emit("clear" , {name : this.name , endName : this.endName} );
			},
			switchShow:function(res){
				if (this.isFocus) {
					return ;
				}
				!this.isShow && this.setValue(this.value);
				this.isShow = !this.isShow ;
			},
			focus:function(res){
				this.isFocus = true ;
				this.setValue(this.value);
				this.isShow = true ;
				setTimeout(e=>{ this.isFocus = false },300);
			},
			blur:function(){
				this.isShow = false ;
			}
		},
		created() {
			setTimeout(()=>{
				this.setValue(this.value);
			}, 0);
		},
		mounted() {
			//dateBox
			var winWidth = uni.getSystemInfoSync().windowWidth ;
			const query = uni.createSelectorQuery().in(this);
			query.select('#dateBox').boundingClientRect(data => {
				if (data && winWidth - data.left < 350) {
					this.isRight = true ;
				}
			}).exec();
		},
		computed: {
			BeginTitle() {
				let value = '未选择';
				if (this.checkeds.length) value = DatepickerTool.format(this.checkeds[0], 'yyyy-mm-dd');
				return value;
			},
			EndTitle() {
				let value = '未选择';
				if (this.checkeds.length == 2) value = DatepickerTool.format(this.checkeds[1], 'yyyy-mm-dd');
				return value;
			},
			PickerTimeTitle() {
				return DatepickerTool.formatTimeArray(this.timeValue, this.showSeconds);
			},
			BeginTimeTitle() {
				return this.BeginTitle != '未选择' ? DatepickerTool.formatTimeArray(this.beginTime, this.showSeconds) : '';
			},
			EndTimeTitle() {
				return this.EndTitle != '未选择' ? DatepickerTool.formatTimeArray(this.endTime, this.showSeconds) : '';
			}
		},
		watch: {
			show(newValue, oldValue) {
				newValue && this.setValue(this.value);
				this.isShow = newValue;
			},
			value(newValue, oldValue) {
				setTimeout(()=>{
					this.setValue(newValue);
				}, 0);
			}
		}
	}
</script>

<style lang="scss" scoped>
	$calendar-item-size: 39px;
	.picker {
		&-calendar {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			flex-wrap: wrap;

			&-view {
				position: relative;
				width: $calendar-item-size;
				height: $calendar-item-size;
				text-align: center;

				&-bgbegin,
				&-bg,
				&-bgend,
				&-item,
				&-dot,
				&-tips {
					position: absolute;
					transition: .2s;
				}

				&-bgbegin,
				&-bg,
				&-bgend {
					opacity: .15;
					height: 80%;
				}

				&-bg {
					left: 0;
					top: 10%;
					width: 100%;
				}

				&-bgbegin {
					border-radius: $calendar-item-size 0 0 $calendar-item-size;
					top: 10%;
					left: 10%;
					width: 90%;
				}

				&-bgend {
					border-radius: 0 $calendar-item-size $calendar-item-size 0;
					top: 10%;
					left: 0%;
					width: 90%;
				}

				&-item {
					left: 5%;
					top: 5%;
					width: 90%;
					height: 90%;
					border-radius: $calendar-item-size;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				&-dot {
					right: 10%;
					top: 10%;
					width: 6px;
					height: 6px;
					border-radius: 6px;
				}

				&-tips {
					bottom: 100%;
					left: 50%;
					transform: translateX(-50%);
					background: #4E4B46;
					color: #fff;
					border-radius: 6px;
					padding: 5px 10px;
					font-size: 12px;
					width: max-content;
					margin-bottom: 5px;
					pointer-events: none;

					&:after {
						content: "";
						position: absolute;
						top: 100%;
						left: 50%;
						transform: translateX(-50%);
						width: 0;
						height: 0;
						border-style: solid;
						border-width: 5px 5px 0 5px;
						border-color: #4E4B46 transparent transparent transparent;
					}
				}
			}
		}
	}

	.picker-calendar-view-item,.picker-icon,.picker-btn{
		cursor: pointer;
	}
	
	.picker-calendar-view-dot{
		display: none;
	}
	.datepicker:focus{
		outline: none;
	}
</style>
