<template>
	<view class="base-cloud">
		<view class="pd15 ">
			<view class="autoX father table-responsive" v-if="list.length > 0 || !showEmpty">
				<table>
					<thead>
						<tr>
							<slot name="thead"></slot>
						</tr>
					</thead>
					<tbody>
						<slot name="tbody"></slot>
					</tbody>
				</table>
			</view>
			
			<empty v-if="showEmpty" :list="list"></empty>
			
		</view>
	</view>
</template>

<script>
	export default {
		name:"tables" ,
		props:{
			list : {
				default : function(e){
					return [] ;
				}
			},
			showEmpty:{
				default : true 
			}
		}
	}
</script>
<style>
	.table-responsive{
		width: 100%;
		margin-bottom: 10px;
		overflow-y: hidden;
		-ms-overflow-style: -ms-autohiding-scrollbar;
		border: 1px solid #ddd;
		min-height: .01%;
		overflow-x: auto;
	}
</style>
