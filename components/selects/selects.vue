<template>
	<view class="selects base-cloud" :tabindex="0" @focus="focus" @blur="blur">
		<labels :noPadding="noPadding" :title="title" :titleWidth="titleWidth" :isVertical="isVertical">
			<view class="father">
				<view class="bd rds2">
					<view class="fixAutoNoPd middle">
						<view>
							<input class="pd10 ptb9" type="text" :focus="showOptions" :placeholder="placeholder" @focus="focus" @blur="blur" v-model="searchKey"  :maxlength="-1" v-if="showOptions" />
							<input class="pd10 ptb9" type="text" :disabled="list.length == 0" :placeholder="placeholder" @focus="focus" @blur="blur" :value="curTitle"  :maxlength="-1" v-else/>
						</view>
						<view class="fz12  w30 text-center" v-if="!curTitle || !showOptions" :class="showOptions ? 'bIcon-arrowUp' : 'bIcon-arrowDown'"></view>
						<view class="fz12  w30 text-center bIcon-close op5 hover" @tap="clear" v-else></view>
					</view>
				</view>
				<view class="abs top z18 top40 animated fadeInUp" :class="{'none' : !showOptions || list.length == 0}">
					<view class="ptb3">
						<view class=" shadow bd shadow whiteBg box autoY">
							<radio-group class="pd10" @change="changed">
								
								<label class="showLabel flex lt ptb7" v-for="( item , index) in list" :key="index" v-if="item[titleKey].indexOf(searchKey) > -1">
									<radio :value="item[valueKey]+''" :color="color" :checked="curVal == item[valueKey] && (!!curVal || curVal === 0 || curVal === false) " :disabled="item[disabledKey]"></radio>
									<view class="plr7" :class="{disabled : item[disabledKey]}">
										{{item[titleKey]}}
										<view class="fz12 gray clip" v-if="item[remarkKey]">
											{{item[remarkKey]}}
										</view>
									</view>
								</label>
								
								<label class="gray emptyLabel">
									抱歉，暂无相关选项~
								</label>
								
							</radio-group>
						</view>
						
					</view>
				</view>
				
				<input type="text" :maxlength="-1" :name="name" :value="curVal" class="none">
				<input type="text" :maxlength="-1" :name="titleName" :value="curTitle" class="none" v-if="titleName">
				
			</view>
		</labels>
	</view>
</template>

<script>
	export default {
		name:"selects",
		model: {
			prop: "value",
			event: "bindModel"
		},
		props:{
			title: {
				default: ""
			},
			titleWidth: {
				default: 90
			},
			isVertical:{
				default : uni.getSystemInfoSync().windowWidth <= 476  
			},
			noPadding:{
				default : false 
			},
			name: {
				default: ""
			},
			titleName: {
				default: ""
			},
			value: {
				default: ''
			},
			list: {
				default: function() {
					return [];
				}
			},
			titleKey : { //说明文字的主键
				default: 'title'
			},
			valueKey : { //值的主键
				default: 'value'
			},
			remarkKey : { 
				default: 'remark'
			},
			disabledKey : {
				default: 'disabled'
			},
			color : {
				default: '#07c160'
			}
		},
		data() {
			return {
				curVal : this.value ,
				placeholder : this.list.length == 0 ? "暂无选项" : "请选择" + this.title ,
				showOptions : false ,
				blurTimerOut:null ,
				searchKey : ''
			};
		},
		
		watch:{
			value:function(){
				this.curVal = this.value ;
			},
			list:function(e){
				this.placeholder = this.list.length == 0 ? "暂无选项" : "请选择" + this.title  ;
			},
		},
		
		computed:{
			
			curTitle:function(e){
				if (this.curVal !== 0 && this.curVal !== false && !this.curVal) {
					return '' ;
				}
				var item = this.list.find(item=>item[this.valueKey] == this.curVal ) ;
				return item ? item[this.titleKey] : "" ;
			},
			
		},
		
		methods:{
			
			clear:function(e){
				this.curVal = "" ;
				this.showOptions = false ;
				this.$emit("bindModel" , "");
				this.$emit("change" , { detail : { value : "" }} );
			},
			
			changed:function(e){
				this.curVal = e.detail.value ;
				this.showOptions = false ;
				this.$emit("bindModel" , this.curVal);
				this.$emit("change" , e);
			},
			
			focus:function(e){
				clearTimeout(this.blurTimerOut);
				if (this.list.length == 0) {
					this.placeholder = "暂无选项";
					return ;
				}
				this.showOptions = true ;
				this.placeholder = "请输入关键字搜索" ;
			},
			
			blur:function(e){
				this.blurTimerOut = setTimeout(e => {
					this.showOptions = false ;
					this.placeholder = this.list.length == 0 ? "暂无选项" : "请选择" + this.title ;
					this.searchKey = "" ;
				},100);
			},
		}
	}
</script>
<style>
	@-webkit-keyframes fadeInUp {
	  from {
	    opacity: 0;
	    -webkit-transform: translate3d(0, 30%, 0);
	    transform: translate3d(0, 30%, 0);
	  }
	
	  to {
	    opacity: 1;
	    -webkit-transform: translate3d(0, 0, 0);
	    transform: translate3d(0, 0, 0);
	  }
	}
	
	@keyframes fadeInUp {
	  from {
	    opacity: 0;
	    -webkit-transform: translate3d(0, 30%, 0);
	    transform: translate3d(0, 30%, 0);
	  }
	
	  to {
	    opacity: 1;
	    -webkit-transform: translate3d(0, 0, 0);
	    transform: translate3d(0, 0, 0);
	  }
	}
	
	.fadeInUp {
	  -webkit-animation-name: fadeInUp;
	  animation-name: fadeInUp;
	}
	.animated {
	  -webkit-animation-duration: 0.2s;
	  animation-duration: 0.2s;
	  -webkit-animation-fill-mode: both;
	  animation-fill-mode: both;
	}
	.top40{
		top: 40px;
	}
	.selects:focus{
		outline: none;
	}
	.showLabel + .emptyLabel{
		display: none;
	}
	.box{
		max-height: 300px;
	}
</style>