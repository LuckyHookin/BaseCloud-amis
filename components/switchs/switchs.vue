<template>
	<labels :title="title" :titleWidth="titleWidth" :isTop="isTop" :isVertical="isVertical">
		<view class="flex lt">
			<switch :checked="checked" @change="change" :color="color" :disabled="disabled"/>
			<view class="ml10 gray fz12" v-if="tip">{{tip}}</view>
		</view>
		<input type="text" :name="name" :value="checked+''" class="none">
	</labels>
</template>

<script>
	export default {
		name:"switchs",
		model: {
			prop: "value",
			event: "bindModel"
		},
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
			name:{
				default : ""
			},
			value : {
				default : true
			},
			color : {
				default : "#07c160"
			},
			tip:{
				default : ""
			},
			disabled:{
				default : false 
			}
		},
		watch:{
			value : function(e){
				this.checked = this.value ;
			}
		},
		data() {
			return {
				checked : this.value 
			};
		},
		methods:{
			change:function(e){
				this.checked = e.detail.value ;
				this.$emit("bindModel" , this.checked);
				this.$emit("change" , e );
			},
		}
	}
</script>

<style>

</style>
