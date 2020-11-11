<template>
	<auth :url="url" :noAuth="noAuth" :isInline="isInline">
		<navigator :url="href">
			<slot></slot>
		</navigator>
	</auth>
</template>

<script>
	export default {
		name : "authNav" ,
		props:{
			url : { //请求权限地址
				type : String , 
				default : ""
			},
			noAuth:{
				type : Boolean , //是否验证无权限
				default : false
			}, 
			isInline : {
				type : Boolean ,
				default : true 
			},
			href : { //跳转链接,对于跳转类的必填，请求类的不填。
				type : String ,
				default : ""
			}
		}
	}
</script>
