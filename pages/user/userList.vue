<template>
	<layout :loading="loading" pageKey="user" title="用户列表">
		
		<block slot="titleLeft">
			<conditions :showFirst="true" :conditions="conditions" :list="conditonList" @confirm="submitSearch"></conditions>
		</block>
		
		<block slot="titleRight">
			<auth-nav href="/pages/user/userEdit" url="user-center/user/info" class="btn w80 flex">
				<text class="bIcon-addCircle mr5"></text>
				添加
			</auth-nav>
		</block>
		
		<tables :list="page.list">
			<block slot="thead">
				<th>用户名</th>
				<th>姓名</th>
				<th>手机号码</th>
				<th>角色</th>
				<th class="autoWidth">备注</th>
				<th>最近登录</th>
				<th>状态</th>
				<th>操作</th>
			</block>
			<block slot="tbody">
				<tr v-for="( x , index) in page.list" :key="index">
					<td class="main bold">{{x.username}}</td>
					<td>
						<view class="flex lt">
							<files :width="50" :list="x.avatar" :isRound="true"></files>
							{{x.realname_auth ? x.realname_auth.contact_person : ''}}
						</view>
					</td>
					<td>{{x.mobile}}</td>
					<td>{{x.roleNames}}</td>
					<td>
						<mores>{{x.comment}}</mores>
					</td>
					<td>{{x.lastLoginTime}}</td>
					<td>
						<switch-btn :disabled="x.isSuperAdmin" url="user-center/user/changeStatus" :params="{id:x._id}" :checked="x.status == 0" @change="statusChanged"></switch-btn>
					</td>
					<td>
						<auth-nav :href="'/pages/user/userEdit?id=' + x._id" class="plr5 bold main" url="user-center/user/info">
							编辑
						</auth-nav>
						<auth-btn v-if="!x.isSuperAdmin" :url="'user-center/user/delete?id='+x._id" confirm="delete" @success="remove(index,1)" class="plr5 bold main">
							删除
						</auth-btn>
					</td>
				</tr>
			</block>
		</tables>
		
		<paginate :page="page" :showPageSize="true" @switchPage="changePaginate"></paginate>

	</layout>
</template>

<script>
	export default {
		data() {
			return {
				conditonList:[
					{title:"状态",name:"status",type:"select",list:[]},
					{title:"用户名",name:"username"},
				],
				conditions:{
					username : ""
				},
				loading: true,
				action: "user-center/user/list",
				page: {
					pageNumber: 1,
					lastPage: true,
					totalPage: 1,
					list: [],
					totalRow: 0,
					pageSize: 10
				}
			}
		},
		
		onLoad(params) {
			this.conditions = params ;
		},

		onShow() {
			this.getPage();
		},

		methods: {
			
			getPage:function(e){
				this.bcc.callInCache({
					url : this.action ,
					data : {
						...this.conditions,
						pageNumber : this.page.pageNumber ,
						pageSize : this.page.pageSize 
					} ,
					success : e => {
						uni.hideLoading();
						e.page.list = e.page.list.map(item=>{
							item.lastLoginTime = this.bcc.date.toStr(item.last_login_date);
							return item ;
						})
						this.page = e.page ;
						this.conditonList[0].list = e.statusList ;
						this.loading = false ;
					}
				});
			},
			
			submitSearch:function(e){
				this.loading = true ;
				this.conditions = e.conditions ;
				this.switchPage();
			},
			
			switchPage: function(pageNumber) {
				uni.showLoading({
					title:"加载中…"
				});
				this.page.pageNumber = pageNumber || this.page.pageNumber ;
				this.getPage();
			},
			
			changePaginate: function(e) {
				this.page.pageSize = e.pageSize ;
				this.page.pageNumber = e.pageNumber ;
				this.switchPage();
			},
			
			remove:function(index){
				uni.showToast({
					title: '已删除',
					icon : 'success'
				});
				this.page.list.splice(index,1);
				this.bcc.clearCache(this.action);
			},
			
			statusChanged:function(e){
				this.bcc.clearCache(this.action);
			},
		}
	}
</script>
