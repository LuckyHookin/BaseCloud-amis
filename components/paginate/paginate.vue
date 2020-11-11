<template>
	<view class="base-cloud">
		<view class="flex" :class="{ct:!isPc}">
			<view class="flex lt plr5" v-if="page.totalPage > 1">
				
				<view>
					<view class="plr10 ptb2" @tap="switchPage(page.pageNumber-1)">
						<view class="square">
							<view class="flex ct">
								<view class="bIcon-arrowLeft" :class="page.pageNumber == 1 ? 'disabled op2' : 'hover'"></view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 当前页-->
				<block v-for="( item , index) in page.totalPage" :key="index">
					<view class="bg rds2"  v-if="item == page.pageNumber">
						<view class="plr10  ptb3 text-center ">
							{{item}}
						</view>
					</view>
					<view class="hover" v-else-if="item < 3 || (page.pageNumber - item < 4 && page.pageNumber - item > -4) || (page.totalPage - item < 3) " @tap="switchPage(item)">
						<view class="plr10 rds2 ptb3 text-center ">
							{{item}}
						</view>
					</view>
					<view class="ellipsis" v-else>
						<view class="plr10 rds2 ptb3 text-center ">
							 … 
						</view>
					</view>
				</block>
				
				<view>
					<view class="plr10 ptb2" @tap="switchPage(page.pageNumber+1)">
						<view class="square">
							<view class="flex ct">
								<view class="bIcon-arrowRight" :class="page.lastPage ? 'disabled op2' : 'hover'"></view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="ml15 showInPc">
					到第
				</view>
				<view class="mlr5 showInPc">
					<view class="w30">
						<input class="ptb3 bd text-center" type="number" min="1" v-model="curPageNum">
					</view>
				</view>
				<view class="showInPc">
					页，每页
				</view>
				<view class="mlr5 showInPc">
					<view class="w30">
						<input class="ptb3 bd text-center" type="number" min="1" v-model="curPageSize">
					</view>
				</view>
				<view class="mr10 showInPc">
					条
				</view>
				
				<button type="button" class="btn grayBg line fz12 ptb2 plr8 showInPc" @click="switchPage(curPageNum)">确定</button>
				<view class="plr15 gray showInPc">共 {{page.totalRow}} 条 </view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "paginate",
		props: {
			page: {
				type: Object,
				default: function(e) {
					return {
						pageNumber: 1,
						lastPage: true,
						totalPage: 1,
						list: [],
						totalRow: 0,
						pageSize: 10
					};
				}
			},
			pageNumber: {
				default: 1
			}
		},

		data() {
			return {
				curPageNum: this.page.pageNumber,
				curPageSize : this.page.pageSize ,
				isPc : uni.getSystemInfoSync().windowWidth > 476 
			};
		},
		
		computed:{
			pageSizeList:function(e){
				var arr = [] ;
				for (var i = 0; i < 19; i++) {
					arr.push({
						title : `${(i+1)*5} 条/页` ,
						value : (i+1)*5
					});
				}
				return arr ;
			},
		},

		methods: {
			
			switchPage: function(curPageNum) {
				var pageSizeChanged = this.curPageSize != this.page.pageSize ;
				var pageNum = curPageNum;
				if (pageSizeChanged) {
					this.curPageNum = 1 ;
					pageNum = 1 ;
				}
				if (pageNum < 1 || pageNum > this.page.totalPage ) {
					return false;
				}
				this.$emit("switchPage", {
					pageSizeChanged ,
					pageNumber :  pageNum ,
					pageSize : this.curPageSize
				});
			},

		}
	}
</script>
<style lang="scss">
	.ellipsis+.ellipsis{
		display: none;
	}
</style>