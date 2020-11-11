<template>
	<labels :title="title" :isVertical="isVertical" :titleWidth="titleWidth">
		<view>
			<checkbox-group class="clear" @change="changed">
				
				<label class="flex fl ptb7" v-for="( item , index) in listSync" :key="index">
					<checkbox :value="item[valueKey]+''" :color="color" :checked="item.checked" :disabled="item[disabledKey]"></checkbox>
					<view class="pl7 pr25" :class="{disabled : item[disabledKey]}">
						{{item[titleKey]}}
					</view>
				</label>
				
			</checkbox-group>
			
			<input type="text" :maxlength="-1" :name="name" :value="curVal+''" class="none">
			<input type="text" :maxlength="-1" :name="titleName" :value="curTitle" class="none" v-if="titleName">
			
		</view>
	</labels>
</template>

<script>
	export default {
		name:"checkboxs",
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
			isVertical:{
				default : uni.getSystemInfoSync().windowWidth <= 476  
			}
			
		},
		data() {
			return {
				curVal : '' ,
				listSync : "" ,
				curTitle : ""
			};
		},
		
		created() {
			this.setCurVal();
			this.setListSync(this.value);
		},
		
		watch:{
			value:function(){
				this.setCurVal();
				this.setListSync(this.value);
			},
			list:function(e){
				this.setCurVal();
				this.setListSync(this.value);
			},
		},
		
		mounted() {
			this.setCurVal();
		},
		
		methods:{
			
			setCurTitle:function(e){
				var choosedList = this.listSync.filter(item => item.checked ).map(item=>item[this.titleKey]);
				this.curTitle = choosedList.join("、") ;
			},
			
			setListSync:function(value){
				var valueList = this.getValueList(value) ;
				this.listSync = this.list.map( item =>{
					item.checked = valueList.length > 0 && valueList.findIndex( cur=> cur == item[this.valueKey] ) > -1 ;
					return item ;
				});
				this.setCurTitle();
			},
			
			setCurVal:function(){
				var valueList = this.getValueList(this.value) ;
				this.curVal = valueList.join(',') ;
			},
			
			getValueList:function(value){
				if (value !== 0 && value !== false && !value) {
					return [] ;
				}
				if (Array.isArray(value)) {
					return value ;
				}
				return (value+"").split(",");
			},
			
			changed:function(e){
				this.curVal = e.detail.value.join(",") ;
				this.setListSync(e.detail.value);
				this.$emit("change" , e);
				this.$emit("bindModel" , this.curVal );
			},
		}
	}
</script>