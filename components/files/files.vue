<template>
	<view class="base-cloud">
		<view class="clear father">
			
			<view @tap="preview(index)" class="fl pd5 father" v-for="( item , index) in listSync" :key="index"  v-if="index <= count - 1 || count == -1" :style="{width : width + 'px' }">
				
				<view class="square hover">
					<block v-if="type == 'image'">
						<view class="grayBg flex ct rds4 bd op8" v-if="item.loading">
							<view class="uni-loading w30 h30"></view>
						</view>
						<view class="grayBg flex ct rds4 bd op8" v-if="item.loadFail">
							<view class="bIcon-loadFail fz40 grey op7"></view>
						</view>
						<image v-if="!item.loadFail" @load="imageLoad(index)" @error="imageError(index)" :src="item.url" mode="aspectFill" class="bd whiteBg" :class="{'rds':isRound,'rds4':!isRound,'op0':item.loading}"></image>
					</block>
					<block v-else-if="type == 'audio'">
						<view class="grayBg rds4 bd op8 flex ct w100p">
							<view class="w100p plr5">
								<image src="./static/mp3.png" mode="widthFix" class="center-block w30 h30 "></image>
								<view class="pt5 clip fz12 gray" style="line-height: 12px;">
									{{item.name}}
								</view>
							</view>
						</view>
					</block>
					<block v-else-if="type == 'video'">
						<view class="grayBg flex ct rds4 bd op8 w100p">
							<view class="w100p plr5">
								<image src="./static/video.png" mode="widthFix" class="center-block w30 h30 "></image>
								<view class="pt5 clip fz12 gray" style="line-height: 12px;">
									{{item.name}}
								</view>
							</view>
						</view>
					</block>
					<block v-else>
						<view class="grayBg w100p flex ct rds4 bd op8">
							<a :title="item.name" class="w100p plr5" :href="item.url" target="_blank">
								<image v-if="type == 'pdf'" src="./static/pdf.png" mode="widthFix" class="center-block w30 h30 "></image>
								<image v-else-if="type == 'apk'" src="./static/apk.png" mode="widthFix" class="center-block w30 h30 "></image>
								<image v-else-if="type == 'zip'" src="./static/zip.png" mode="widthFix" class="center-block w30 h30 "></image>
								<view class="pt5 clip fz12 gray" style="line-height: 12px;">
									{{item.name}}
								</view>
							</a>
						</view>
					</block>
				</view>
				<view class="abs top1 right1 pd5" @tap.stop="remove(index)" v-if="!disabled">
					<view class="plr8 wp fz12 hover white rdsTr4" title="删除">x</view>
				</view>
			</view>
			
		</view>
		
		<block v-if="show">
			<swiper class="fixed blackBg w100p h100p z19" :current="current" :circular="true" :indicator-dots="listSync.length > 1" :autoplay="false" :duration="200">
				<swiper-item @tap="close" v-for="( item , index) in listSync" :key="index"  v-if="index <= count - 1 || count == -1">
					<image v-if="type == 'image'" :src="item.url"  class="w100p h100p" mode="aspectFit"></image>
					<view class="w100p h100p flex ct" v-else-if="type == 'audio'">
						<audio v-if="type == 'audio'" :src="item.url" :controls="true"></audio>
					</view>
					<video  v-else-if="type == 'video'" class="w100p h100p" :src="item.url" :controls="true"></video>
				</swiper-item>
			</swiper>
			
			<view class="fixed left flex z20 plr40" @tap="close"  v-if="listSync.length > 1">
				<view class="w40" @tap.stop="switchNext(-1)">
					<view class="square">
						<view class="rds wp8 flex ct white hover shadow">
							<view class="bIcon-arrowLeft"></view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="fixed right flex z20 plr40" @tap="close"  v-if="listSync.length > 1">
				<view class="w40" @tap.stop="switchNext(1)">
					<view class="square">
						<view class="rds wp8 flex ct white hover shadow">
							<view class="bIcon-arrowRight"></view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="fixed z20 top30 right30" v-if="type != 'image'">
				<view class="w40" @tap.stop="show=false">
					<view class="square">
						<view class="rds wp8 flex ct white hover shadow">
							<view class="bIcon-close fz40"></view>
						</view>
					</view>
				</view>
			</view>
			
		</block>
	</view>
</template>

<script>
	export default {
		name : "images" ,
		props:{
			width : {
				default : 80
			},
			isRound:{
				default : false
			},
			list : {
				default : function(e){
					return [] ;
				}
			},
			count : {
				default : -1
			},
			disabled:{
				default : true 
			},
			valueKey: {
				default: ''
			},
			type : {
				default : 'image'
			}
		},
		data() {
			return {
				show : false ,
				current : 0 ,
				listSync : [] 
			};
		},
		created() {
			this.setList(true);
		},
		watch:{
			list:function(e){
				this.setList(false);
			}
		},
		methods:{
			
			imageLoad:function(index){
				this.listSync[index].loading = false ;
			},
			
			imageError:function(index){
				this.listSync[index].loading = false ;
				this.listSync[index].loadFail = true ;
			},
			
			setList:function(isInit){
				var list = this.getList(this.list);
				var curList = this.valueKey ? list.map(item=>item[this.valueKey]) : list ;
				this.listSync = curList.map((item,index)=>{
					return {
						url : item ,
						name : this.valueKey ? list[index].name : '' ,
						loading : isInit && this.type == 'image' ,
						loadFail : false 
					} ;
				});
			},
			
			getList:function(value){
				if (value !== 0 && value !== false && !value) {
					return [] ;
				}
				if (Array.isArray(value)) {
					return value ;
				}
				if (this.valueKey) {
					return JSON.parse(value);
				}
				return (value+"").split(",");
			},
			
			switchNext:function(index){
				var nextIndex = this.current + index ;
				if (nextIndex == -1) {
					nextIndex == this.listSync.length -1 ;
				}
				if (nextIndex == this.listSync.length) {
					nextIndex = 0 ;
				}
				this.current = nextIndex ;
			},
			
			remove:function(index){
				this.$emit("remove" , { 
					detail : {
						value : index
					}
				});
			},
			
			preview:function(index){
				console.log("...");
				if(['image','audio',"video"].indexOf(this.type) == -1){
					return ;
				}
				this.current = index ;
				this.show = true ;
			},
			
			close:function(e){
				if (this.type == 'image') {
					this.show = false ;
				}
			},
		}
	}
</script>

<style>

</style>
