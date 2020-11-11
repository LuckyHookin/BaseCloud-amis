<template>
	<layout :loading="loading" pageKey="menu" title="菜单列表">
	
		<block slot="titleLeft">
			<view :title="isSlideUp ? '展开菜单' : '收起菜单'" class="hover plr15" :class="isSlideUp ? 'bIcon-showAll' : 'bIcon-hideAll'" @tap="toggleAll"></view>
		</block>
		
		<block slot="titleRight">
			<auth url="admin/menu/info">
				<view class="btn w80 flex" @tap="showAlert">
					<text class="bIcon-addCircle mr5"></text>
					添加
				</view>
			</auth>
		</block>
		
		<alerts width="600px" height="85%" :title="`${data._id?'编辑菜单信息':'新增菜单'}`" ref="edit">
			<form @submit="submit" data-action="admin/menu/save" data-back="/pages/menu/menuList" data-clear="admin/menu/list">
				
				<radios title="菜单类型" :defaultFirst="true" :list="menuTypeList" :value="data.type" name="x.type|请选择菜单类型" @change="chooseMenuType"></radios>
				
				<view class="">
					
					<inputs name="x.name|菜单名称" title="菜单名称" :value="data.name"></inputs>
					
					<block v-if="data.type == 1">
						<inputs v-if="data.type == 1" name="x.icon|图标" title="图标" :value="data.icon"></inputs>
						
						<inputs type="number" name="x.orderNum|排序|count|empty" title="排序" :value="data.orderNum" placeholder="选填"></inputs>
						
						<inputs type="hidden" name="x.parentId" value="0"></inputs>
						
					</block>
					<block v-else>
						
						<labels title="父级菜单"  v-if="data.type == 3" >
							<view class="gridNoMb gridSmPd">
								<view>
									<selects :noPadding="true" @change="changeRootMenu"  title="" :titleWidth="0" :list="rootMenuList" :value="rootId" titleKey="name" valueKey="_id"></selects>
								</view>
								<view>
									<selects :noPadding="true" title="" :titleWidth="0" :list="subMenuList" name="x.parentId|请选择父级菜单" :value="data.parentId" titleKey="name" valueKey="_id"></selects>
								</view>
							</view>
						</labels>
						
						<selects v-if="data.type==2" @change="changeRootMenu"  title="父级菜单" :list="rootMenuList" name="x.parentId|请选择父级菜单" :value="data.parentId" titleKey="name" valueKey="_id"></selects>
						
						<textareas :height="50" title="权限地址" @blur="inputBlur" name="x.url" :value="data.url" placeholder="多个权限地址请用英文分号隔开(选填)"></textareas>
						
						<inputs name="x.pages|页面链接" title="页面链接" @blur="pagesChanged" :value="data.pages" v-if="data.type == 2"></inputs>
						
						<inputs name="x.key|页面标识" title="页面标识" v-model="data.key" v-if="data.type == 2"></inputs>
						
						<inputs type="number" name="x.orderNum|排序|count|empty" title="排序" :value="data.orderNum" placeholder="选填"></inputs>
						
						<inputs name="x.saveLogUrl|日志路径|empty" title="日志路径" :value="data.saveLogUrl" placeholder="选填"></inputs>
						
					</block>
					
					<switchs v-if="data.type != 3" name="x.isShow|是否显示" title="菜单栏显示" v-model="data.isShow" :tip="data.isShow != false?'展示在菜单栏中':'不展示在菜单栏中'"></switchs>
					
					<radios :class="{'none' : data.type == 3}" title="展示平台" :defaultFirst="true" :list="platformList" :value="data.platform?data.platform:1" name="x.platform|请选择展示平台"></radios>
					
				</view>
				
				<labels class="mt10">
					<inputs type="hidden" name="x._id" :value="data._id" v-if="data._id"></inputs>
					<button class="btn greenBg w80" form-type="submit">{{ !data._id ? '保存' : '修改'}}</button>
					<button class="btn grayBg line w80" @tap="$refs.edit.hide">取消</button>
				</labels>
				
			</form>
		</alerts>
		
		<tables :list="list" :showEmpty="false">
			<block slot="thead">
				<th>名称</th>
				<th>排序</th>
				<th>菜单类型</th>
				<th class="autoWidth">URL</th>
				<th class="autoWidth">日志路径</th>
				<th class="autoWidth">路径</th>
				<th>页面标识</th>
				<th>展示平台</th>
				<th>显示状态</th>
				<th>操作</th>
			</block>
			<block slot="tbody">
				<block v-for="( x , index) in list" :key="x._id" v-if="x.type == 1">
					
					<tr>
						<td class="main bold hover" @tap="x.isSlideUp=!x.isSlideUp">
							<view class="flex">
								<view>
									{{x.name}}
								</view>
								<view class="fz12 gray normal op3 pl10" :class="x.isSlideUp?'bIcon-arrowRight':'bIcon-arrowDown'"></view>
							</view>
							
						</td>
						<td>{{x.orderNum}}</td>
						<td>{{x.typeName}}</td>
						<td>
							<mores>{{x.url}}</mores>
						</td>
						<td>
							<mores>{{x.saveLogUrl}}</mores>
						</td>
						<td>
							
						</td>
						<td>
							
						</td>
						<td>
							{{x.platformStr}}
						</td>
						<td :class="x.isShow ? '' : 'gray' ">
							{{x.isShow ? '显示' : '隐藏'}}
						</td>
						<td>
							<auth-btn :url="'admin/menu/info?id='+x._id" @success="getInfoSuccess" class="main bold mlr5">
								编辑
							</auth-btn>
							<auth-btn :url="'admin/menu/delete?id='+x._id" confirm="delete" @success="remove(index)" class="main bold mlr5">
								删除
							</auth-btn>
						</td>
					</tr>
					
					<block v-for="( s , sIndex) in list" :key="s._id" v-if="s.parentId == x._id && s.type == 2 && !x.isSlideUp">
						
						<tr>
							<td  @tap="s.isSlideUp=!s.isSlideUp"> 
								<view class="hover">
									<text class="bIcon-right fz12 grey mr5 ml10"></text>
									<text class="bold black">
										{{s.name}}
									</text>
								</view>
							</td>
							<td>{{s.orderNum}}</td>
							<td>
								{{s.typeName}}
							</td>
							<td>
								<mores>{{s.url}}</mores>
							</td>
							<td>
								<mores>{{s.saveLogUrl}}</mores>
							</td>
							<td>
								<copy :text="s.pages">
									
								</copy>
							</td>
							<td>
								{{s.key}}
							</td>
							<td>
								{{s.platformStr}}
							</td>
							<td :class="s.isShow ? '' : 'gray' ">
								{{s.isShow ? '显示' : '隐藏'}}
							</td>
							<td>
								<auth-btn :url="'admin/menu/info?id='+s._id" @success="getInfoSuccess" class="main bold mlr5">
									编辑
								</auth-btn>
								<auth-btn :url="'admin/menu/delete?id='+s._id" confirm="delete" @success="remove(sIndex)" class="main bold mlr5">
									删除
								</auth-btn>
							</td>
						</tr>
						
						<block v-for="( t , tIndex) in list" :key="t._id" v-if="t.parentId == s._id && t.type == 3 && !s.isSlideUp">
							
							<tr>
								<td><view class="pl30">{{t.name}}</view></td>
								<td>{{t.orderNum}}</td>
								<td>{{t.typeName}}</td>
								<td><mores>{{t.url}}</mores></td>
								<td>
									<mores>{{t.saveLogUrl}}</mores>
								</td>
								<td></td>
								<td></td>
								<td>
									{{t.platformStr}}
								</td>
								<td :class="t.isShow ? '' : 'gray' ">
									{{t.isShow ? '显示' : '隐藏'}}
								</td>
								<td>
									<auth-btn :url="'admin/menu/info?id='+t._id" @success="getInfoSuccess" class="main bold mlr5">
										编辑
									</auth-btn>
									<auth-btn  :url="'admin/menu/delete?id='+t._id" confirm="delete" @success="remove(tIndex)" class="main bold mlr5">
										删除
									</auth-btn>
								</td>
							</tr>
							
						</block>
						
					</block>
					
				</block>
			</block>
		</tables>
		
		
	</layout>
</template>

<script>
	export default {
		data() {
			return {
				menuTypeList:[],
				platformList:[],
				loading: true ,
				isSlideUp: false ,
				action: "admin/menu/list",
				list: [] ,
				data : {
					type : 1 ,
					key : "",
					saveLogUrl : "",
					pages : "/pages/",
					isShow : true 
				},
				rootId : ''
			}
		},
		
		computed:{
			rootMenuList:function(e){
				return this.list.filter(item=>item.type == 1);
			},
			subMenuList : function(e){
				return this.list.filter(item=>item.type == 2 && item.parentId == this.rootId);
			}
		},

		onShow() {
			this.getList();
		},

		methods: {
			toggleAll:function(e){
				this.isSlideUp = !this.isSlideUp ;
				this.list.forEach(item=>{
					item.isSlideUp = this.isSlideUp ;
				})
			},
			
			toggle:function(index){
				this.$set(this.list[index],'isSlideUp' , !this.list[index].isSlideUp);
			},
			
			getList:function(e){
				if (!this.loading) {
					uni.showLoading({
						title:"加载中…"
					});
				}
				this.bcc.callInCache({
					url : this.action ,
					success : e => { 
						this.list = e.list.map(item=>{
							item.isSlideUp = false ;
							return item ;
						}) ;
						this.menuTypeList = e.menuTypeList || [] ;
						this.platformList = e.platformList || [] ;
						this.loading = false ;
						uni.hideLoading();
					}
				});
			},
			
			inputBlur:function(e){
				var value = e.detail.value ;
				if(!!this.data.saveLogUrl || !value) return ;
				this.data.saveLogUrl = value ;
			},
			
			pagesChanged:function(e){
				var value = e.detail.value ;
				if(!!this.data.key || !value) return ;
				var keys = value.replace("/pages/","").split("/");
				this.data.key = keys.reduce( (key , cur) =>{
					if (!cur || !key) {
						return key ;
					}
					if (!!key) {
						return key + cur.split('')[0].toUpperCase() + cur.substr(1);
					}
				})
			},
			
			submit:function(e){
				this.bcc.submit(e , res=>{
					this.$refs.edit.hide();
					this.bcc.clearCache(this.action);
					this.getList();
					this.refreshMenu(); //刷新本地菜单
				});
			},
			
			refreshMenu:function(e){
				this.bcc.call({
					url : 'admin/menu/globalData' ,
					success : res => { 
						uni.setStorageSync("menuList" , res.list);
						uni.setStorageSync("admin" , res.user );
						this.admin = res.user ;
						this.menuList = res.list ;
					}
				});
			},
			
			changeRootMenu:function(e){
				this.rootId = e.detail.value ;
				this.data.parentId = this.data.type == 2 ? e.detail.value : '' ;
			},
			
			chooseMenuType:function(e){
				var type  = e.detail.value ;
				this.data['type'] = parseInt(type) ;
			},
			
			setRootMenuId : function(e){
				if (this.data.type == 1) {
					return ;
				}
				var subMenu = this.list.find(item=>item._id == this.data.parentId);
				if (!subMenu) {
					return ;
				}
				if (this.data.type == 2) {
					this.rootId = subMenu._id ;
					return ;
				}
				var rootMenu = this.list.find(item=>item._id == subMenu.parentId);
				if (!rootMenu) {
					return ;
				}
				this.rootId = rootMenu._id ;
			},
			
			getInfoSuccess:function(res){
				this.data = res.data || this.data ;
				this.setRootMenuId();
				uni.hideLoading();
				this.$refs.edit.show();
			},
			
			remove:function(index){
				uni.showToast({
					title: '已删除',
					icon : 'success'
				});
				this.list.splice(index,1);
				this.bcc.clearCache(this.action);
				this.refreshMenu(); //刷新本地菜单
			},
			
			showAlert:function(e){
				this.rootId = '' ;
				this.data = {
					type : 1 ,
					key : "",
					saveLogUrl : "",
					pages : "/pages/",
					isShow : true 
				};
				this.$refs.edit.show();
				
			},
		}
	}
</script>
