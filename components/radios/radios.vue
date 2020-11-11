<template>
	<labels :title="title" :isVertical="isVertical" :titleWidth="titleWidth">
		<view>
			<radio-group class="clear" @change="changed">
				
				<label class="flex fl ptb7" v-for="( item , index) in list" :key="index">
					<radio :value="item[valueKey]+''" :color="color" :checked="curVal == item[valueKey]" :disabled="item[disabledKey]"></radio>
					<view class="pl7 pr25" :class="{disabled : item[disabledKey]}">
						{{item[titleKey]}}
					</view>
				</label>
				
			</radio-group>
			<input type="text" :maxlength="-1" :name="name" :value="curVal" class="none">
			<input type="text" :maxlength="-1" :name="titleName" :value="curTitle" class="none" v-if="titleName">
		</view>
	</labels>
</template>

<script>
	export default {
		name:"radios",
		model:{
			prop: "value",
			event: "bindModel"
		},
		props:{
			title: {
				default: ""
			},
			titleWidth: {
				default: 90
			},
			isVertical:{
				default : uni.getSystemInfoSync().windowWidth <= 476  
			},
			name: {
				default: ""
			},
			titleName: {
				default: ""
			},
			value: {
				default: ''
			},
			list: {
				default: function() {
					return [];
				}
			},
			titleKey : { //说明文字的主键
				default: 'title'
			},
			valueKey : { //值的主键
				default: 'value'
			},
			disabledKey : {
				default: 'disabled'
			},
			color : {
				default: '#07c160'
			},
			defaultFirst:{
				default : true 
			}
		},
		data() {
			return {
				curVal : '' ,
				curTitle : ''
			};
		},
		
		created() {
			this.curVal = this.value || '' ;
			this.setDefaultValue();
		},
		
		watch:{
			value:function(){
				this.curVal = this.value || '' ;
				this.setDefaultValue();
			},
		},
		
		methods:{
			
			setCurTitle:function(e){
				if (this.curVal !== 0 && this.curVal !== false && !this.curVal) {
					this.curTitle = '' ;
				}
				var item = this.list.find(item=>item[this.valueKey] == this.curVal ) ;
				this.curTitle = item ? item[this.titleKey] : "" ;
			},
			
			changed:function(e){
				var value = e.detail.value ;
				this.curVal = value ;
				this.setCurTitle();
				this.$emit("change" , e);
				this.$emit("bindModel" , this.curVal );
			},
			
			setDefaultValue:function(res){
				if ( !this.bcc.isNull(this.value) ) {
					this.setCurTitle();
					return ;
				}
				if (this.list.length > 0 && this.defaultFirst) {
					this.curVal = this.list[0][this.valueKey];
					this.setCurTitle();
					this.$emit("change" , {detail:{value : this.curVal}});
					this.$emit("bindModel" , this.curVal );
				}
			},
		}
	}
</script>
