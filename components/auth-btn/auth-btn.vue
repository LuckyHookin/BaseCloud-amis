<template>
	<auth :noAuth="noAuth" :url="url" :isInline="isInline">
		<view class="hover" @tap="callFunction">
			<slot></slot>
		</view>
	</auth>
</template>

<script>
	export default {
		name : "auth-btn" ,
		props:{
			url : {
				default : ""
			},
			confirm : { //请求之前的确认文字，请求类选填，如果是删除默认文字，可以简写为delete
				default : ""
			},
			alert : { //请求成功后弹窗的文字，请求类选填
				type : String ,
				default : ""
			},
			params : {
				default : function(e){
					return {} ;
				}
			},
			showFail:{
				default : true 
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
		methods:{
			callFunction:function(e){
				if (!this.url) {
					console.log("未定义请求url");
					return ;
				}
				var confirm = this.confirm == 'delete' ? "删除后不可恢复，确认删除吗？" : this.confirm ;
				if (!this.confirm) {
					this.doRequest();
					return ;
				}
				uni.showModal({
					title:'提示',
					content: confirm ,
					confirmColor:'#07c160',
					success : (e)=>{
						if (e.confirm) {
							this.doRequest();
						}
					}
				});
			},
			
			doRequest:function(e){
				uni.showLoading({
					title:"加载中…",
					mask:true 
				});
				this.bcc.call({
					url : this.url ,
					data : this.params ,
					success : e => {
						if (this.alert) {
							uni.showModal({
								title:'提示',
								content: Boolean(this.alert) === true ? e.msg : this.alert ,
								confirmColor:'#07c160',
								showCancel:false
							});
						}
						this.$emit("success" , e);
					},
					fail: err => {
						if (this.showFail) {
							uni.showToast({
								title: err.msg ,
								icon : 'none'
							});
						}
						this.$emit("fail" , err );
					},
					complete: e => {
						uni.hideLoading();
					}
				});
			},
		}
	}
</script>

<style>

</style>
