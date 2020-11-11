<template>
	<layout :loading="loading||loadingRole" pageKey="user" :title="id ? '修改用户':'新增用户'">

		<form @submit="submit" data-action="user-center/user/save">

			<view class="w650">
				<checkboxs title="角色" :list="roleList" name="x.roleIds|请选择角色" :value="data.roleIds" titleName="x.roleNames" titleKey="name" valueKey="_id"></checkboxs>
				
				<inputs name="x.username|用户名" title="用户名" :value="data.username"></inputs>
				
				<inputs name="x.password|密码|6~20|empty" title="密码" v-if="!!data._id" placeholder="不修改请留空"></inputs>
				<inputs name="x.password|密码|6~20" title="密码" v-else></inputs>
				
				<inputs name="x.realname_auth.contact_person|姓名|2~10" title="姓名" :value="data.realname_auth ? data.realname_auth.contact_person : ''"></inputs>
				
				<inputs type="number" name="x.mobile|联系电话|mobile" title="联系电话" :value="data.mobile"></inputs>
				
				<inputs name="x.comment|备注|0~200|empty" title="备注" :value="data.comment" placeholder="选填"></inputs>
			</view>
			
			<labels class="mt40">
				<inputs type="hidden" name="x._id" :value="id" v-if="id"></inputs>
				<button class="btn greenBg w80" form-type="submit">{{ !data._id ? '保存' : '修改'}}</button>
				<button class="btn grayBg line w80" form-type="reset">重置</button>
				<button class="btn grayBg line w80" @click="bcc.goBack()">取消</button>
			</labels>
			
		</form>

	</layout>
</template>

<script>
	export default {
		data() {
			return {
				loading: true ,
				loadingRole: true ,
				id : '' ,
				data : {
					userType : ""
				},
				roleList : []
			}
		},
		
		onLoad(params) {
			this.id = params.id ;
			this.loadData();
			this.getRoleList();
		},
		
		methods: {
			
			submit:function(e){
				var {fail , data} = this.bcc.checkData(e);
				if ( fail) {
					return ;
				}
				uni.showLoading({
					title:"请稍后…",
					mask:true 
				});
				if (data['x.password']) {
					data['x.password'] = this.bcc.sign(data['x.password']);
				}
				this.bcc.call({
					keepStr : true ,
					url : 'user-center/user/save' ,
					data : data ,
					success : res => {
						uni.hideLoading();
						this.bcc.clearCache("user-center/user/list");
						this.bcc.goSuccessBack("/pages/user/userList","保存成功");
					}
				});
			},
			
			loadData : function(e){
				if (!this.id) {
					this.loading = false ;
					return ;
				}
				this.bcc.call({
					url : 'user-center/user/info' ,
					data : {id : this.id},
					success : res => { 
						this.data = res.data || this.data ;
						this.loading = false ;
					}
				});
			},
			
			getRoleList:function(e){
				this.bcc.callInCache({
					url : 'admin/role/options' ,
					data : {},
					success : res => { 
						this.roleList = res.list || [];
						this.loadingRole = false ;
					}
				});
			},
		}
	}
</script>

<style>

</style>
