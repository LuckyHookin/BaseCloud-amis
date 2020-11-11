<template>
	<view class="base-cloud" :style="style" v-if="hasAuth || noAuth">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name : "auth" ,
		props:{
			url : { //请求权限地址
				type : String , 
				default : ""
			},
			noAuth:{
				type : Boolean , //是否验证无权限
				default : false
			}, 
			isInline : {
				type : Boolean ,
				default : true 
			}
		},
		computed:{
			hasAuth : function(e){
				if (!this.url) {
					return true ;
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
			style:function(res){
				return this.isInline ? 'display:inline-block' : ''
			},
		}
	}
</script>

<style>

</style>
