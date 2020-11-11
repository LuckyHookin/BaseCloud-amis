<template>
	
	<view class="base-cloud">
		
		<table>
			<thead>
				<tr>
					<th>
						一级菜单
					</th>
					
					<th >
						二级菜单
					</th>
					
					<th class="autoWidth">
						操作
					</th>
				</tr>
			</thead>
			<tbody>
				<block v-for="( x , index) in myList" :key="x._id" v-if="x.type == 1">
					
					<tr v-for="( s , sIndex) in myList" :key="s._id" v-if="s.parentId == x._id">
						
						<td :rowspan="x.total" v-if="s._id == x.firstChildId">
							<view class="flex lt hover" @tap="checkFirst(index)">
								<view class="mr7 fz16" :class="x.isChecked  ? 'bIcon-choosedFill main' : 'bIcon-choosed gray op7'"></view>
								<view>
									{{x.name}}
								</view>
							</view>
						</td>
						<td >
							<view class="flex lt hover" @tap="checkSec(sIndex)">
								<view class="mr7 fz16" :class="s.isChecked  ? 'bIcon-choosedFill main' : 'bIcon-choosed gray op7'"></view>
								<view>
									{{s.name}}
								</view>
							</view>
						</td>
						<td class="pl5">
							<view class="clear" >
								<view class="fl mlr5" v-for="( t , tIndex) in myList" :key="t._id" v-if="t.parentId == s._id">
									<view class="flex lt hover" @tap="checkThird(tIndex)">
										<view class="mr7 fz16" :class="t.isChecked  ? 'bIcon-choosedFill main' : 'bIcon-choosed gray op7'"></view>
										<view>
											{{t.name}}
										</view>
									</view>
								</view>
							</view>
						</td>
					</tr>
					
					
					
				</block>
			</tbody>
		</table>
		
		<input type="text" :name="name" :value="myValue" style="display: none;">
		
	</view>
	
</template>

<script>
	export default {
		name : "menu-groups" ,
		props:{
			name : { //请求权限地址
				type : String , 
				default : "menuId"
			},
			value : {
				type : [String,Array] ,
				default : ""
			},
			list:{
				type : Array , 
				default : function(res){
					return [] ;	
				}
			}
		},
		created : function(e){
			this.initValue();
		},
		watch:{
			value : function(res){
				this.initValue();
			},
			list : function(res){
				this.initValue();
			},
		},
		data() {
			return {
				myList : this.list 
			};
		},
		
		computed:{
			myValue : function(res){
				var val = [] ;
				for (var i = 0; i < this.myList.length; i++) {
					var cur = this.myList[i];
					if(cur.isChecked){
						val.push(cur._id);
					}
				}
				return val.join(",") ;
			}
		},
		
		methods:{
			initValue : function(res){
				var value = this.value ;
				var list = JSON.parse(JSON.stringify(this.list));
				for (var i = 0; i < list.length; i++) {
					var cur = list[i];
					cur['isChecked'] = this.isCheckedByValue(cur._id) ;
					if(cur.type == 1){
						this.dealSub(list , i);
					}
				}
				this.myList = list ;
			},
			
			isCheckedByValue:function(id){
				var value = this.value ;
				if(!value){
					return false ;
				}
				var arr = value instanceof Array ? value : value.split(",");
				for (var i = 0; i < arr.length; i++) {
					var cur = arr[i];
					if(cur == id){
						return true ;
					}
				}
				return false ;
			},
			
			dealSub:function( list , index){
				var parent = list[index] ;
				var parentId = parent._id ;
				var subList = [] ;
				for (var i = 0; i < list.length; i++) {
					var cur = list[i];
					if(cur.parentId == parentId){
						if(subList.length == 0){
							parent['firstChildId'] = cur._id ;
						}
						subList.push(cur);
					}
				}
				parent['total'] = subList.length ;
				return list ;
			},
			
			checkThird:function(index){
				var cur = this.myList[index];
				cur.isChecked = !cur.isChecked ;
				var parentId = cur.parentId ;
				var grandpaId = this.checkParent(parentId);
				this.checkParent(grandpaId);
			},
			
			checkSec:function(index){
				var cur = this.myList[index];
				cur.isChecked = !cur.isChecked ;
				var parentId = cur.parentId ;
				this.checkParent(parentId);
				for (var i = 0; i < this.myList.length; i++) {
					var third = this.myList[i];
					if(third.parentId == cur._id){
						third.isChecked = cur.isChecked ;
					}
				}
			},
			
			checkFirst :function(index){
				var first = this.myList[index];
				var isChecked = !first.isChecked ;
				first.isChecked = isChecked ;
				for (var i = 0; i < this.myList.length; i++) {
					var cur = this.myList[i];
					if(cur.parentId == first._id){
						cur.isChecked = isChecked ;
						for (var j = 0; j < this.myList.length; j++) {
							var third = this.myList[j];
							if(third.parentId == cur._id){
								third.isChecked = isChecked ;
							}
						}
					}
				}
			},
			
			checkParent:function(parentId){
				var needCheck = false ;
				for (var i = 0; i < this.myList.length; i++) {
					var cur = this.myList[i];
					if(cur.parentId == parentId && cur.isChecked){
						needCheck = true ;
						break ;
					}
				}
				
				for (var i = 0; i < this.myList.length; i++) {
					var cur = this.myList[i];
					if(cur._id == parentId){
						cur.isChecked = !cur.isChecked ? needCheck : true ;
						return cur.parentId ;
					}
				}
			}
		}
	}
</script>