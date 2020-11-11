<template>
	<view class="base-cloud" @tap="copy" style="display: inline-block;">
		<view class="inline hover">
			<text v-if="showText">
				{{text}}
			</text>
			<slot></slot>
			<text v-if="showIcon" class="bIcon-copyFill fz12 ml5 gray op3" title="点击复制"></text>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	import '../../common/js/clipBoard.js';
	// #endif
	export default {
		name: 'copy',
		props: {
			text: {
				default: ''
			},
			showText : {
				default : true 
			},
			showIcon:{
				default : false 
			}
		},
		methods: {
			copy : function(e){
				if (!this.text) {
					console.log('无可复制的数据');
					return false ;
				}
				uni.setClipboardData({
					data: this.text ,
					success : function(e){
						uni.showToast({
							title: '复制成功',
							icon : 'success'
						});	
					}
				})
			},
		}
	}
</script>
