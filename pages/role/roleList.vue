<template>
	<layout :loading="loading" pageKey="role" title="角色列表">
		
		<block slot="titleRight">
			<auth-nav href="/pages/role/roleEdit" url="admin/role/info" class="btn w80 flex">
				<text class="bIcon-addCircle mr5"></text>
				添加
			</auth-nav>
		</block>
		
		<tables :list="list">
			<block slot="thead">
				<th>角色名称</th>
				<th>类型</th>
				<th class="autoWidth">权限描述</th>
				<th>更新时间</th>
				<th>操作</th>
			</block>
			<block slot="tbody">
				<tr v-for="( x , index) in list" :key="index">
					<td>{{x.name}}</td>
					<td>{{x.typeStr}}</td>
					<td>{{x.remark}}</td>
					<td>{{x.updateTimeStr}}</td>
					<td>
						<auth-nav :href="`/pages/role/roleEdit?id=${x._id}`" url="admin/role/info" class="main bold plr5">
							编辑
						</auth-nav>
						<auth-btn :url="`admin/role/delete?id=${x._id}`" confirm="delete" @success="remove(index)" class="main bold plr5">
							删除
						</auth-btn>
					</td>
				</tr>
			</block>
		</tables>

	</layout>
</template>

<script>
	export default {
		data() {
			return {
				loading: true ,
				action: "admin/role/list",
				list: []
			}
		},

		onShow() {
			this.bcc.callInCache({
				url : this.action ,
				success : e => { 
					this.list = e.list.map(item=>{
						item.updateTimeStr = this.bcc.date.toStr(item.updateTime);
						return item ;
					}) ;
					this.loading = false ;
				}
			});
		},

		methods: {
			remove:function(index){
				this.bcc.clearCache(this.action);
				this.list.splice(index,1);
				uni.showToast({
					title: '已删除',
					icon : 'success'
				});
			},
		}
	}
</script>
