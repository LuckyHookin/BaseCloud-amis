<template>
	<view class="base-cloud">
		<view class="whiteBg pb80 fixed flex ct z20">
			<view class="text-center block w100p">
				<view class="fz90" v-if="icon" :class="icon" :style="{color: iconColor}"></view>
				<view class="w100 center-block mb10" v-if="image">
					<view class="square">
						<image :src="image" mode="aspectFill"></image>
					</view>
				</view>
				<view class="ptb5 fz18">{{title}}</view>
				<view class="grey plr30" v-if="desc">
					<text>
						{{desc}}
					</text>
				</view>
				<view class="pt100 text-center plr30">
					<slot></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'results',
		props: {
			title: {
				default: ""
			},
			desc: {
				default: ""
			},
			image:{
				default : ''
			},
			icon: {
				default: ""
			},
			iconColor : {
				default : "#07c160"
			}
		},
		data() {
			return {
				
			};
		},
	}
</script>