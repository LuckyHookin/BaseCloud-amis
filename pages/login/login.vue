<template>
	<block v-if="loading">
		<empty :loading="true"></empty>
	</block>
	<block v-else>
		<view class="base-cloud">
			<view class="fixed">
				<view class="abs op1 loginBg"></view>
				<view class="abs flex ct " :class="isPc?'plr':''">
					<view class="rds25 shadow flex " :class="isPc?'w1200 h700 ':'ww hh ct'">
						<view class="w50p h100p blackBg rdsBl23 rdsTl23 father" v-if="isPc">
							<view class="zfx w35 h35"></view>
							<view class="cfx w130 h20"></view>
							<view class="sjx w0 h0"></view>
							<view class="abs flex ct">
								<view class="w400">
									<image src="../../static/logoText.png" mode="widthFix" class="block w400 h30"></image>
									<view class="fz15 mt20" style="color: #dfad83;line-height: 34px;">
										BaseCloud是一套基于uniapp、uniCloud、uni-id的全栈开发框架，不依赖任何第三方框架，极度精简轻巧。
									</view>
								</view>
							</view>
						</view>
						<view class=" h100p whiteBg  " :class="isPc?'w50p rdsBr23 rdsTr23 pb100 flex ct ':'w100p ptb50 plr20'">
							<view class="abs top-30 right-50 grayBg w100 h100 rds op4 showInMb"></view>
							<view class="abs bottom30 left-50 grayBg w100 h100 rds op4 showInMb"></view>
							<form @submit="submit" data-action="user-center/user/login" :data-keepStr="true" :class="isPc?'w360 plr':'w100p'">
								<view class="w90 center-block">
									<view class="square mb50">
										<image src="../../static/logo.jpg" mode="aspectFill" class="rds shadow"></image>
									</view>
								</view>
								
								<view class="fixAuto bd grayBd grayBg mb20 middle">
									<view class="w40 bIcon-userFill brown op3 fz16 text-center"></view>
									<view>
										<input name="username|用户名|2~20" class="pd10 plr5" type="text" :disabled="disabled" @tap="disabled == false" placeholder="请输入用户名" placeholder-class="fz16 gray">
									</view>
								</view>
								
								<view class="fixAuto bd grayBd grayBg mb30 middle">
									<view class="w40 bIcon-passwordFill brown op3 fz16 text-center"></view>
									<view>
										<input name="password|密码|6~22" class="pd10 plr5" type="password" placeholder="请输入登录密码" placeholder-class="fz16 gray">
									</view>
								</view>
								
								<button form-type="submit" class="roundBtn block shadow fz18 submitBtn">
									<view class="ptb2">
										立即登录
									</view>
								</button>
								
							</form>
							
						</view>
					</view>
				</view>
			</view>
		</view>
	</block>
	
</template>

<script>
	export default {
		data() {
			return {
				disabled : true ,
				loading : true ,
				admin : {} ,
				menuList : [] ,
				isPc : uni.getSystemInfoSync().windowWidth > 476
			}
		},
		onLoad(params) {
			if (!!params.token) {
				uni.setStorageSync("uniIdToken" , params.token);
			}
			if (!!params.pages) {
				uni.setStorageSync("beforeLoginPage" , params.pages );
			}
			this.checkSession();
		},
		onShow() {
			setTimeout((e)=>{
				this.disabled = false ;
			},1000);
			//绑定表单提交事件
			this.bcc.bindEnter(this , "toSumit");
		},
		methods: {
			
			toSumit:function(e){
				document.getElementsByClassName("submitBtn")[0].click();
			},
			
			checkSession:function(e){
				var token = uni.getStorageSync("uniIdToken");
				if (!token) {
					this.loading = false ;
					return ;
				}
				this.bcc.call({
					url : 'user-center/user/checkToken' ,
					success : e => { 
						this.redirectByMenu();	
					},
					fail: e => {
						this.bcc.clearStorage();
						this.loading = false ;
					}
				});
			},
			
			submit : function(e){
				var res = this.bcc.checkData(e);
				if (res.fail) {
					return ;
				}
				uni.showLoading({
					title:"登录中…",
					mask:true 
				});
				var data = res.data ;
				data['password'] = this.bcc.sign(data.password);
				this.bcc.call({
					url : 'user-center/user/login' ,
					data : data ,
					success : res => { 
						uni.hideLoading();
						this.redirectByMenu();
					}
				});
			},
			
			redirectByMenu:function(e){
				this.bcc.call({
					url : 'admin/menu/globalData' ,
					success : res => { 
						uni.setStorageSync("menuList" , res.list);
						uni.setStorageSync("admin" , res.user );
						this.admin = res.user ;
						this.menuList = res.list ;
						//从本地存储自动登录
						var beforePage = uni.getStorageSync("beforeLoginPage");
						if (!!beforePage && beforePage != "/pages/login/login") {
							uni.removeStorageSync("beforeLoginPage");
							uni.redirectTo({
								url: beforePage 
							});
							this.loading = false ;
							return ;
						}
						
						var url = this.bcc.getFirstSubMenuPages();
						uni.redirectTo({
							url: url || "/pages/index/index"
						});
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page{
	  background:#1c1c1c;
	}

	.zfx{
		position: absolute;
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
		background-color: #1c1c1c;
		right: 30px;
		top: 60px;
	}

	.cfx{
		position: absolute;
		-webkit-transform: rotate(15deg);
		transform: rotate(15deg);
		position: absolute;
		background-color: #1c1c1c;
		right: 60px;
		bottom: 60px;
		max-width: 30%;
	}

	.sjx{
		position: absolute;
		border-style: solid;
		border-width: 90px 60px 90px;
		border-color: transparent #1c1c1c transparent transparent;
		position: absolute;
		bottom: 50px;
		left: -20px;
		-webkit-transform: rotate(-35deg);
		transform: rotate(-35deg);
	}

	.loginBg{
		background-image: url(../../static/loginBg.png);
	}

	.grayBd{
		border-color: #d2d2d2;
	}
	.w400{
		max-width: 90%;
	}
	.w1200{
		max-width: 100%;
	}
	.w360{
		max-width: 100%;
	}
</style>
