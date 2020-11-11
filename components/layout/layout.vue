<template>
	<view class="father hh ww">
		
		<view class="base-cloud">
			<!-- 顶部 -->
			<view class="lightBackBg h50 shadow plr10 fixed top z9">
				<view class="flex pl5 h100p">
					<view class="flex lt lfz16" v-if="isPc" >
						<image class="w250 h20" src="../../static/logoTextLight.png" mode="widthFix"></image>
						<view :title="isShowAll ? '收起菜单' : '展开菜单'" class="hover plr15 showInPc" :class="isShowAll ? 'bIcon-showAll' : 'bIcon-hideAll'" @tap="toggleAll"></view>
					</view>
					<button @tap="changeMenuStatus" hover-class="op9" class="bIcon-listFill showInMb plr5 ptb10"></button>
					<view class="flex rt">
						<view class="plr15 white bold">
							{{admin.username}}
						</view>
						<view class="white "  :class=" pageKey == 'setting'?'op10':'op7'">
							<auth-nav href="/pages/setting/setting" url="user-center/user/modify" class="plr15">
								<text class="bIcon-set mr5"></text>
								设置
							</auth-nav>
						</view>
						<view class="hover plr15 op7" @tap="quit">退出</view>
					</view>
				</view>
			</view>
			
			<!-- 左侧菜单栏 -->
			<view :class="isPc?'':'fixed wp'"  v-if="showMenu" @tap="changeMenuStatus">
				<view class="w220 hidden fixed left" :animation="fadeOutData" :class="isPc ? '':'fadeInLeft'" @tap.stop="stop">
					
					<!-- 菜单区域 -->
					<scroll-view :scroll-y="true" :scroll-into-view="intoViewId" class="abs left w240 whiteBg shadow autoY " :class="isPc?'pt50':''">
						
						<view class="menuItem w220" :id="`s_${item._id}`" v-for="( item , index) in menuList" :key="item._id" v-if="item.type == 1 && item.isShow && ( !item.platform || item.platform == 1 || (item.platform == 2 && isPc ) || (item.platform == 3 && !isPc ) ) ">
							<!-- 一级菜单 -->
							<view class="fixAuto plr10 hover bold bt bl2 whiteBd" :class="{bb : !item.isClosed , 'main' : item.subChoosed}" @tap="item.isClosed = !item.isClosed">
								<view class="w20" :class="item.icon"></view>
								<view>
									<view class="flex">
										<view>{{item.name}}</view>
										<view class="fz12 op8" :class="item.isClosed ? 'bIcon-arrowUp' : 'bIcon-arrowDown'"></view>
									</view>
								</view>
							</view>
							<!-- 二级菜单 -->
							<view class="black grayBg" v-if="!item.isClosed">
								<navigator :url="sub.pages" class="pl35 ptb10 hover bl7" :class="{'main mainLightBg mainBd': sub.key == pageKey , 'grayBd' :  sub.key != pageKey}"  v-for="( sub , sIndex) in menuList" :key="sub._id" v-if="sub.parentId == item._id  && sub.isShow && ( !sub.platform || sub.platform == 1 || (sub.platform == 2 && isPc ) || (sub.platform == 3 && !isPc ) ) ">
									{{sub.name}}
								</navigator>
							</view>
						</view>
						
					</scroll-view>
				</view>
			</view>
			<!-- 顶部区域 -->
			<view class="pt50" id="layout_header" :class="isPc?'pl220':''">
				<view :class="isPc?'pd15 pb0':''">
					<view class="whiteBg  father">
						<view class="flex pd10 plr15 bb">
							<view class="flex">
								<view class="mr10 noBreak" v-if="isPc">
									{{title ? title : defaultTItle}}
								</view>
								<slot name="titleLeft"></slot>
							</view>
							<view>
								<slot name="titleRight"></slot>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 内容区域 -->
		<view class="layout-content" v-if="innerScroll">
			<scroll-view :scroll-y="true" class="shadow" style="background-color: #fff;overflow-y: auto;"  :style="{'height': contentHeight + 'px'}">
				<block v-if="loading">
					<empty :loading="true"></empty>
				</block>
				<block v-else>
					<!-- 自定义内容 -->
					<slot></slot>
				</block>
			</scroll-view>
		</view>
		<view class="layout-content" :style="{'min-height': contentHeight + 'px'}" v-else>
			<view class="shadow" style="background-color: #fff;"  >
				<block v-if="loading">
					<empty :loading="true"></empty>
				</block>
				<block v-else>
					<!-- 自定义内容 -->
					<slot></slot>
				</block>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		name: "layout",
		props: {
			loading: {
				default: false
			},
			innerScroll: {
				default: true
			},
			title : {
				default : ""
			},
			pageKey : {
				default : ""
			}
		},
		data() {
			return {
				admin: uni.getStorageSync("admin") || {} ,
				menuList: [],
				isShowAll : true ,
				headerHeight : 30 ,
				intoViewId : '' ,
				isPc : uni.getSystemInfoSync().windowWidth > 476 ,
				showMenu : uni.getSystemInfoSync().windowWidth > 476 ,
				fadeOutData : null
			};
		},
		mounted() {
			uni.setNavigationBarTitle({
				title: this.title ? this.title : this.defaultTItle
			});
			
			const query = uni.createSelectorQuery().in(this);
			query.select('#layout_header').boundingClientRect(data => {
			  if (data && data.height > 0) {
			  	this.headerHeight = data.height ;
			  }
			}).exec();
			
			setTimeout(e => {
				this.resetIntoViewId();
			},10);
			
		},
		computed:{
			contentHeight:function(e){
				var bottom = this.isPc ? 15 : 0 ;
				return uni.getSystemInfoSync().windowHeight - this.headerHeight - bottom ;
			},
			defaultTItle:function(e){
				var curMenu = this.menuList.find(item=>item.key == this.pageKey);
				try{
					if (curMenu.type == 2 || curMenu.type == 3) {
						var parentMenu = this.menuList.find(item => item._id == curMenu.parentId);
						return `${ parentMenu.name} > ${curMenu.name}` ;
					}
				}catch(e){
					return '' ;
				}
				return '' ;
			},
		},
		created() {
			var menuList = uni.getStorageSync("menuList") || [];
			if (menuList.length == 0) {
				this.bcc.clearStorage();
				uni.setStorageSync("beforeLoginPage" , this.bcc.getPageRoute());
				uni.redirectTo({
					url: "/pages/login/login"
				});
				return ;
			}
			menuList.forEach(item=>{
				item.isClosed = false ;
			});
			this.menuList = menuList ;
		},
		methods:{
			
			stop:function(e){},
			
			changeMenuStatus:function(e){
				if (this.isPc) {
					return ;
				}
				if (!this.showMenu) {
					this.showMenu = true ;
					return ;
				}
				var animation = uni.createAnimation({
					duration: 300 ,
					timingFunction: 'ease',
				});
				animation.translateX(-300).step();
				this.fadeOutData = animation.export();
				setTimeout((e)=>{
					this.showMenu = false ;
					this.fadeOutData = null ;
				},320);
			},
			
			resetIntoViewId:function(e){
				var curMenu = this.menuList.find(item=>item.key == this.pageKey);
				this.intoViewId = curMenu ? 's_'+ curMenu.parentId : 's_' ;
			},
			
			quit: function(e) {
				uni.showLoading({
					title:"退出中…"
				});
				this.bcc.call({
					url : 'user-center/user/logout' ,
					success : res => {
						uni.hideLoading();
						this.bcc.clearStorage();
						uni.reLaunch({
							url: "/pages/login/login"
						});
					}
				});
			},
			
			toggleAll:function(e){
				this.isShowAll = !this.isShowAll ;
				this.menuList.forEach(item=>{
					if (this.isShowAll) {
						item.isClosed = false ;
						item.subChoosed = false ;
						return ;
					}
					item.isClosed = true ;
					item.subChoosed = this.menuList.findIndex( cur => cur.type == 2 && cur.parentId == item._id && cur.key == this.pageKey ) > -1 ;
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.shadow{
	box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.1);
}
.lightBackBg{
	background-color: #191919;
	color: #fff;
}
.mainLightBg{
	background-color: rgba($main,0.1);
}
.father{
	position: relative;
}
.ww{
	width: 100vw;
}
.hh{
	height: 100vh;
}

.grayBd{
	border-color: #f7f7f7;
}
.fadeInLeft{
	animation: fadeInLeft 0.2s ease-in-out;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@media (min-width:476px) {
	.layout-content{
		padding:0 15px 15px 235px;
	}
}

</style>
