<template>
	<text class="base-cloud">
		<text class="price avanti" :class="{noPrefix:!showPrefix}">{{intPrice}}<text class="point" v-if="dotPrice">.{{dotPrice}}</text></text>
	</text>
</template>

<script>
	export default {
		name: 'price',
		props: {
			price: {
				type: [Number,String],
				default: 0.00
			},
			showPrefix:{
				default : true 
			},
			fixed:{ //保留小数点的位数，如需自适应请填写-1
				default:-1
			}
		},
		data() {
			return {
				
			};
		},
		computed: {
			
			intPrice:function(e){
				if(typeof this.price == "undefined"){
					return "" ;
				}
				return parseInt(this.price);
			},
			
			dotPrice:function(e){
				if(typeof this.price == "undefined"){
					return "" ;
				}
				var dotPrice = this.price%1 ;
				// if(dotPrice == 0) return "" ;
				if (this.fixed == -1) {
					dotPrice = parseInt(dotPrice.toFixed(2)*100)/100 ;
					return dotPrice == 0 ? "" : dotPrice.toString().replace("0.","") ;
				}
				dotPrice = dotPrice.toFixed(this.fixed) ;
				return dotPrice.toString().replace("0.","") ;
			}
			
		},
		
		methods: {
			
		}
	}
</script>

<style>

</style>
