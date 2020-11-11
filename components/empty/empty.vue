<template>
	<view class="base-cloud">
		<view class="ptb200 flex ct" v-if="list.length == 0">
			<block v-if="loading">
				<div class="dotGroup">
					<view class="dot"></view>
					<view class="dot"></view>
					<view class="dot"></view>
					<view class="dot"></view>
				</div>
			</block>
			<block v-else>
				<view class="text-center grey op7">
					<view class="fz40 bIcon-noData"></view>
					<view class="text-center fz14 ptb20">{{tips}}</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		name: "empty",
		props: {
			tips: {
				type: String ,
				default: "抱歉，暂无数据~"
			},
			list : {
				type : Array ,
				default : function(e){
					return [] ;
				}
			},
			loading : {
				type : Boolean ,
				default : false 
			}
		}
	}
</script>

<style lang="scss" scoped>
.dotGroup{
	padding: 100px 0;
	text-align: center;
	.dot{
		display: inline-block;
		width: 10px;
		height: 10px;
		background-color: $main ;
		-webkit-border-radius: 100%;
		-moz-border-radius: 100%;
		border-radius: 100%;
		margin: 0 4px;
		animation:scale infinite 0.7s ;
		&+.dot{
			background-color: rgba($main,0.9);
			animation-delay: 0.2s ;
			&+.dot{
				background-color: rgba($main,0.8);
				animation-delay: 0.3s ;
				&+.dot{
					background-color: rgba($main,0.7);
					animation-delay: 0.4s ;
				}
			}
		}
	}
}

@keyframes scale{
	0%,100%{
		transform: scale(1);
		opacity: 1;
	}	
	50%{
		opacity: 0.5;
		transform: scale(0.2);
	}
}
</style>
