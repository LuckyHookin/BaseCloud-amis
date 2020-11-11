<template>
	<layout :loading="loading" pageKey="paramConfig" title="系统参数配置">

		<block slot="titleRight">
			<auth-nav href="/pages/paramConfig/paramConfigEdit" url="admin/paramConfig/info" class="btn w80 flex">
				<text class="bIcon-addCircle mr5"></text>
				添加
			</auth-nav>
		</block>
		
		<tables :list="list">
			<block slot="thead">
				<th>键名</th>
				<th>参数名</th>
				<th class="autoWidth">参数值</th>
				<th class="autoWidth">备注</th>
				<th>更新时间</th>
				<th>操作</th>
			</block>
			<block slot="tbody">
			
				<tr v-for="( x , index) in list" :key="index">
					<td>
						<copy :text="x._id"></copy>
					</td>
					<td>
						{{x.name}}
					</td>
					<td>
						<mores>{{x.value}}</mores>
					</td>
					<td>
						<mores>{{x.remark}}</mores>
					</td>
					<td>
						{{x.updateTimeStr}}
					</td>
					<td>
						<auth-nav :href="'/pages/paramConfig/paramConfigEdit?id=' + x._id" url="admin/paramConfig/info" class="main bold plr5">
							编辑
						</auth-nav>
						<auth-btn url="admin/paramConfig/delete" :params="{id:x._id}" confirm="delete" @success="remove(index)" class="main bold plr5">
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
				action: "admin/paramConfig/list",
				list: []
			}
		},
		
		onLoad:function(res){
			
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
				uni.showToast({
					title: '已删除',
					icon : 'success'
				});
				this.list.splice(index,1);
				this.bcc.clearCache(this.action);
			},
		}
	}
</script>