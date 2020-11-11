<template>
	<layout :loading="loading" pageKey="operateLog" title="操作日志">
		
		<block slot="titleLeft">
			<conditions :showCount="1" :conditions="conditions" :list="conditonList" @confirm="submitSearch"></conditions>
		</block>
		
		<tables :list="page.list">
			<block slot="thead">
				<th>时间</th>
				<th>用户名</th>
				<th>操作菜单</th>
				<th>请求路径</th>
				<th class="autoWidth">参数</th>
				<th>操作IP</th>
			</block>
			<block slot="tbody">
				<tr v-for="( x , index) in page.list" :key="index">
					<td>
						{{x.createTimeStr}}
					</td>
					<td>
						{{x.userName}}
					</td>
					<td>
						{{x.name}}
					</td>
					<td>
						<copy :text="x.actionName" :showIcon="false"></copy>
					</td>
					<td>
						<mores>{{x.params}}</mores>
					</td>
					<td>
						{{x.ip}}
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
					{title:"时间",name:"createTimeStart", endName:"createTimeEnd", type:"time" , timeType : "rangetime",valueType:"timestamp"  },
					{title:"请求路径",name:"actionName",type:"varchar"},
					{title:"操作菜单",name:"name",type:"text"},
					{title:"用户名",name:"userName",type:"varchar"}
				],
				conditions: {},
				loading: true ,
				action: "admin/operateLog",
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
			var that = this ;
			this.getPage();
		},

		methods: {
			
			getPage:function(e){
				this.bcc.call({
					url : this.action ,
					data : {
						...this.conditions,
						pageNumber : this.page.pageNumber ,
						pageSize : this.page.pageSize 
					} ,
					success : e => {
						uni.hideLoading();
						e.page.list = e.page.list.map(item=>{
							item.createTimeStr = this.bcc.date.toStr(item.createTime);
							return item ;
						});
						this.page = e.page ;
						this.conditonList[1].list = e.statusList ;
						this.loading = false ;
					}
				});
			},
			
			submitSearch:function(e){
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
			},
		}
	}
</script>
