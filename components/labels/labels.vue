<template>
	<view class="base-cloud">
		<view class="fixAuto" :class="{middle : !isTop , 'fixAutoNoPd' : noPadding ,'plr15 fixAuto':!noPadding}" v-if="!isVertical">
			<view :style="{width : (titleWidth + 10) + 'px'}" v-if="titleWidth > 0">
				{{title}}
			</view>
			<view :class="{pl0:titleWidth <=0}">
				<slot></slot>
			</view>
		</view>
		<view :class="{'plr ':!noPadding}" v-else>
			<view class="bold ptb10"  v-if="titleWidth > 0">{{title}}</view>
			<view>
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"labels" ,
		props:{
			title : {
				default : ""
			},
			titleWidth : {
				default : 90
			},
			isTop:{
				default : false 
			},
			isVertical:{
				default : uni.getSystemInfoSync().windowWidth <= 476 
			},
			noPadding:{
				default : false 
			}
		}
	}
</script>
