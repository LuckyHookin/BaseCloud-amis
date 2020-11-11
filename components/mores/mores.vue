<template>
	<view class="base-cloud">
		<view class="father hidden" @tap="toggle">
			<view class="hover break " :class="isOn?'':'op0'" :style="{height : height}">
				<slot></slot>
			</view>
			<view class="abs top" id="oneLine" :class="{op0:isOn}">
				<view class="hover cut">
					<slot></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name : "mores" ,
		props:{
			auto : {
				default : false 
			}
		},
		data() {
			return {
				isOn : this.auto ,
				height : 22
			};
		},
		mounted() {
			this.resetHeight();
		},
		methods:{
			resetHeight:function(res){
				const query = uni.createSelectorQuery().in(this);
				query.select('#oneLine').boundingClientRect(data => {
				  if (data && data.height > 0) {
				  	this.height = this.isOn ? 'auto' : data.height + 'px' ;
				  }
				}).exec();
			},
			
			toggle:function(){
				this.isOn = !this.isOn ;
				this.resetHeight();
			},
		}
	}
</script>
