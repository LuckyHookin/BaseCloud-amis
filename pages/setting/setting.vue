<template>
	<layout :loading="loading" pageKey="setting" title="修改资料">

		<form @submit="submit">

			<view class="w650">
				
				<uploads title="头像" name="x.avatar" v-model="data.avatar" :count="1"></uploads>
				
				<inputs title="用户名" :value="data.username" :disabled="true"></inputs>
				
				<inputs name="x.password|密码|6~20|empty" title="密码" placeholder="不修改请留空"></inputs>
				
				<inputs name="x.realname_auth.contact_person|姓名|2~10" title="姓名" :value="data.realname_auth ? data.realname_auth.contact_person : ''"></inputs>
				
				<inputs type="number" name="x.mobile|联系电话|mobile" title="联系电话" :value="data.mobile"></inputs>
				
				<inputs name="x.comment|备注|0~200|empty" title="备注" :value="data.comment" placeholder="选填"></inputs>
			</view>
			
			<labels class="mt40">
				<button class="btn greenBg w100" form-type="submit">保存修改</button>
			</labels>
			
		</form>

	</layout>
</template>

<script>
	export default {
		data() {
			return {
				loading: true ,
				data : {} ,
				fileList : [{
					url : "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-base-cloud-test/e5e3c889-97ce-4730-8535-4eeb46635229.png"
				}]
			}
		},
		
		onLoad() {
			this.loadData();
		},
		
		methods: {
			
			submit:function(e){
				var res = this.bcc.checkData(e);
				if (res.fail) {
					return ;
				}
				uni.showLoading({
					title:"请稍后…",
					mask:true 
				});
				var data = res.data ;
				if (data['x.password']) {
					data['x.password'] = this.bcc.sign(data['x.password']);
				}
				this.bcc.call({
					url : 'user-center/user/modify' ,
					data : data ,
					success : res => {
						uni.hideLoading();
						uni.showToast({
							title: '保存成功',
							icon : 'success'
						});
					}
				});
			},
			
			loadData : function(e){
				this.bcc.call({
					url : 'user-center/user/myInfo' ,
					data : {id : this.id},
					success : res => { 
						this.data = res.data || this.data ;
						this.loading = false ;
					}
				});
			}
		}
	}
</script>
