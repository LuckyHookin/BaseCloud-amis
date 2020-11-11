<template>
	<view class="base-cloud">
		<view class="father" @tap="toSwitch">
			<switch :checked="checkedSync" :color="color" :disabled="disabled"/>
			<view class="abs" :class="disabled?'disabled':'hover'"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"switch-btn",
		props:{
			url : {
				default : ""
			},
			params : {
				default : function(e){
					return {} ;
				}
			},
			checked:{
				default : ""
			},
			disabled:{
				default : false
			},
			color:{
				default : "#07c160"
			}
		},
		data() {
			return {
				checkedSync : this.checked 
			};
		},
		watch : {
			checked : function(e){
				this.checkedSync = this.checked ;
			},
		},
		methods:{
			toSwitch:function(e){
				if ( this.disabled || !this.hasAuth()) {
					return ;
				}
				uni.showLoading({
					title:"请稍后…"
				});
				this.bcc.call({
					url : this.url ,
					data : this.params || {} ,
					success : res => {
						uni.hideLoading();
						this.checkedSync = !this.checkedSync ;
						e.detail.value = this.checkedSync ;
						this.$emit("change" , e );
					}
				});
			},
			
			hasAuth : function(e){
				if (!this.url) {
					return false ;
				}
				var menuList = uni.getStorageSync("menuList") || [];
				if (menuList.length == 0 ) {
					console.log("未配置菜单或未登录，menuList:" , menuList );
					return false ;
				}
				var url = this.url ;
				var index = url.indexOf("?");
				if(index > -1){
					url = url.substr(0,index);
				}
				var authIndex = menuList.findIndex( item=> item.url && item.url.indexOf(url) > -1 );
				if (authIndex == -1) {
					console.log("noAuth:" , url );
				}
				return authIndex > -1 ;
			},
		},
	}
</script>

<style>

</style>
