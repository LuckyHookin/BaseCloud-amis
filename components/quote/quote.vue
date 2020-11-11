<template>
	<view class="base-cloud">
		<view class="father">
			<view class="abs op1" :style="{'background-color' : color }"></view>
			<view class="bl5 father pd z2" :style="{color : color , 'border-color' : color }">
				<view class="pb10 bold" v-if="title">{{title}}</view>
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"quote",
		props:{
			color : {
				default : "#07c160"
			},
			title : {
				default : ""
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>
