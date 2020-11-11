<template>
	<layout :loading="loadingMenu || loadingData" pageKey="role" :title="data._id ? '修改角色':'新增角色'">
 
		<form @submit="submit" data-action="admin/role/save" data-back="/pages/role/roleList" data-clear="admin/role/list">

			<inputs name="x.name|角色名称" title="角色名称" :value="data.name"></inputs>
			
			<radios title="类型" name="x.type|请选择角色类型" :list="typeList" :value="data.type"></radios>
			
			<textareas title="角色描述" name="x.remark|角色描述|empty" :value="data.remark?data.remark:''" :maxlength="200" placeholder="选填"></textareas>
			
			<labels :isTop="true" title="权限配置">
				<menu-groups :list="menuList" name="x.menuIds" :value="data.menuIds"></menu-groups>
			</labels>
			
			<labels class="mt40">
				<inputs type="hidden" name="x._id" :value="id" v-if="id"></inputs>
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
				loadingData : true ,
				loadingMenu: true ,
				id : '' ,
				data : {
					
				},
				typeList:[],
				menuList:[],
			}
		},
		
		onLoad(params) {
			this.id = params.id ;
			this.loadData();
			this.loadMenuList();
		},
		
		methods: {
			
			submit:function(e){
				this.bcc.submit(e);
			},
			
			loadData : function(e){
				var that = this ;
				var data = {
					id : this.id 
				} ;
				this.bcc.call({
					url : 'admin/role/info' ,
					data : data ,
					success : res => { 
						this.data = res.data || {};
						this.typeList = res.typeList ;
						this.loadingData = false ;
					}
				});
			},
			
			loadMenuList:function(e){
				var data = {} ;
				this.bcc.call({
					url : 'admin/menu/list' ,
					data : {},
					success : res => { 
						this.menuList = res.list ;
						this.loadingMenu = false ;
					}
				});
			},
		}
	}
</script>

<style>

</style>
