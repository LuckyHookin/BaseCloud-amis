<template>
	<layout :loading="loading" pageKey="paramConfig" :title="data._id ? '修改菜单':'新增菜单'">

		<form @submit="submit" data-action="admin/paramConfig/save" data-back="/pages/paramConfig/paramConfigList" data-clear="admin/paramConfig/list">

			<div>
				
				<selects @change="changeId" title="参数项" :list="list" name="x._id" titleName="x.name" :value="data._id"></selects>
				
				<textareas name="x.value|参数值" title="参数值" :value="data.value"></textareas>
				
				<textareas name="x.remark|备注|empty" title="备注" :value="data.remark" placeholder="选填"></textareas>
				
			</div>
			
			<labels class="mt40">
				<button class="btn greenBg w80" form-type="submit">{{ !data._id ? '保存' : '修改'}}</button>
				<button class="btn grayBg line w80" @click="bcc.goBack()">取消</button>
			</labels>
			
		</form>

	</layout>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				loading: true ,
				data : {_id:""}
			}
		},
		onLoad(params) {
			this.data._id = params.id ;
			this.loadData();
		},
		
		methods: {
			
			changeId:function(e){
				this.data = { _id : e.detail.value };
				this.loadData();
			},
			
			submit:function(e){
				this.bcc.submit(e);
			},
			
			loadData : function(e){
				var data = {
					id : this.data._id 
				} ;
				this.bcc.call({
					url : "admin/paramConfig/info" ,
					data ,
					success:(res)=>{
						this.list = res.options || [] ;	
						this.data = res.data || this.data ;
						this.loading = false ;
					}
				});
			}
		}
	}
</script>