<template>
	<view>
		<!-- #ifdef H5 -->
		<view class="base-cloud">
			<view class="fixAuto plr15" v-if="!isVertical">
				<view :class="{pt7:autoHeight}" :style="{width : (titleWidth + 10) + 'px'}">
					{{title}}
				</view>
				<view>
					<view class="bd rds2">
						<view class="fixAutoNoPd ptb7 pl10 h35 father">
							<view :class="{'grayBg disabled':disabled , 'pb15' : maxlength != -1 }" >
								<textarea v-on="inputListeners" :name="name" v-bind="$attrs"  v-bind:value="valueSync" :auto-height="autoHeight" :disabled="disabled" :class="{'black disabled':disabled}" :maxlength="maxlength" :style="{height:height+'px'}"></textarea>
								<view class="abs bottom right pr5 gray" v-if="maxlength > -1">
									{{valueSync.length}}/{{maxlength}}
								</view>
							</view>
							<view class="w20 bIcon-close op2 hover" v-if="isShowClearIcon" @tap="clear"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="plr" v-else>
				<view class="bold ptb10">{{title}}</view>
				<view class="bd rds2">
					<view class="fixAutoNoPd ptb7 pl10 h35 father">
						<view :class="{'grayBg disabled':disabled , 'pb15' : maxlength != -1 }" >
							<textarea v-on="inputListeners" :name="name" v-bind="$attrs"  v-bind:value="valueSync" :auto-height="autoHeight" :disabled="disabled" :class="{'black disabled':disabled}" :maxlength="maxlength" :style="{height:height+'px'}"></textarea>
							<view class="abs bottom right pr5 gray" v-if="maxlength > -1">
								{{valueSync.length}}/{{maxlength}}
							</view>
						</view>
						<view class="w20 bIcon-close op2 hover" v-if="isShowClearIcon" @tap="clear"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		name: "textareas",
		model: {
			prop: "value",
			event: "bindModel"
		},
		props: {
			title: {
				default: ""
			},
			name: {
				default: ""
			},
			value: {
				default: ""
			},
			disabled:{
				default : false 
			},
			titleWidth: {
				default: 90
			},
			showClearIcon:{
				default : true 
			},
			maxlength:{
				default:-1
			},
			autoHeight:{
				default : false 
			},
			height : {
				default : 100
			},
			isVertical:{
				default : uni.getSystemInfoSync().windowWidth <= 476 
			},
		},
		
		watch:{
			value : function(e){
				this.valueSync = this.value ;
			},
		},
		
		computed: {
			
			inputListeners: function() {
				var vm = this ;
				return Object.assign({}, this.$listeners , {
					input: (event) => {
						vm.valueSync = event.target.value ;
						vm.$emit('input', event);
						vm.$emit('bindModel', event.target.value);
					}
				});
			},
			isShowClearIcon:function(e){
				return this.showClearIcon && (!!this.valueSync || this.valueSync === false || this.valueSync === 0 ) && !this.disabled ;
			},
		},
		data() {
			return {
				valueSync:this.value 
			};
		},
		methods: {
			clear:function(e){
				this.valueSync = "" ;
				e.detail.value = "" ;
				this.$emit('input', e);
				this.$emit('bindModel', "");
			},
		}
	}
</script>