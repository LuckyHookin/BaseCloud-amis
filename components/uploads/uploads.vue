<template>
	<labels :title="title" :titleWidth="titleWidth" :isTop="isTop" :isVertical="isVertical" :noPadding="noPadding">
		<view class="clear father" style="left: -5px;">

			<files :type="type" :valueKey="valueKey?valueKey:'url'" class="fl" :list="fileList" :width="width" :count="count" @remove="remove" :disabled="false"></files>
			
			<view class="fl pd5" @tap="chooseFile" v-if="list.length < count || count == -1" :style="{width:width+'px'}">
				<view class="square">
					<view class="flex ct bd dashed rds4  hover">
						<view class="  gray  op6" :class="type == 'image' ? 'bIcon-photoFill fz24' : 'bIcon-add fz30'"></view>
					</view>
				</view>
			</view>

			<input type="text" :maxlength="-1" :name="name" :value="curValue" class="none">

		</view>
	</labels>
</template>

<script>
	import './chooseFile.js';
	export default {
		name: "uploads",
		model: {
			prop: "value",
			event: "bindModel"
		},
		props: {
			width : {
				default : 80
			},
			title: {
				default: ""
			},
			titleWidth: {
				default: 90
			},
			isTop: {
				default: false
			},
			isVertical: {
				default:  uni.getSystemInfoSync().windowWidth <= 476 
			},
			count: {
				default: -1
			},
			name: {
				default: ""
			},
			value: {
				default: function(e) {
					return [];
				}
			},
			valueKey: {
				default: ''
			},
			deleteUrl: {
				default: ""
			},
			type: { //image、audio、video、pdf、apk、zip
				type: String ,
				default: "image" 
			},
			maxDuration : {
				default : 600 //时长，单位s
			},
			sourceType :{
				default : function(){
					return ['album', 'camera'] ;
				}
			},
			compressed:{
				default : false  
			},
			camera : {
				default : 'back'
			},
			prefix : { //上传文件文件名的前缀
				default : ''
			},
			noPadding:{
				default : false 
			},
			parseArray : { //是否提交数组类型的数据
				default : false 
			}
		},
		data() {
			return {
				list: [],
				fileList: [],
				mime2ext: {
					'image/png': 'png',
					'image/jpeg': 'jpg',
					'image/gif': 'gif',
					'image/svg+xml': 'svg',
					'image/bmp': 'bmp',
					'image/webp': 'webp',
					'audio/mp3': 'mp3', //音频
					'video/mp4': 'mp4', //视频
					'audio/ogg': 'ogg', //视频
					'video/webm': 'webm' //视频
				},
				extentionMap:{
					pdf : ["pdf"] ,
					image : ["png","jpg","gif","jpeg"] ,
					audio : ["mp3"] ,
					video : ["mp4"]
				},
				typeMap: {
					image: ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/bmp', 'image/webp'],
					audio: ['audio/mp3'],
					video: ['video/mp4', 'audio/ogg', 'video/webm'],
					pdf : ["application/pdf"],
					zip : ["application/zip"] 
				},
				totalSize: 0,
				files: [],
				isUploadChange : false 
			};
		},
		created() {
			this.setList();
		},
		computed: {
			curValue: function(e) {
				return this.valueKey ? JSON.stringify(this.fileList) : (this.parseArray ? JSON.stringify(this.list) : this.list.join(',') )  ;
			},
			widthSync : function(e){
				if (this.bcc.isNumber(this.width)) {
					return this.width + 'px' ;
				}
				return this.width ;
			}
		},
		watch: {
			value: function(e) {
				this.setList();
			}
		},
		methods: {
			
			chooseFile: function() {
				if(this.type == 'image'){
					this.chooseImage();
					return ;
				}
				if(this.type == 'video'){
					this.chooseVideo();
					return ;
				}
				if(this.type == 'audio'){
					this.chooseAudio();
					return ;
				}
				this.chooseFiles();
			},

			setList: function() {
				var list = this.getValueList(this.value, this.valueKey);
				if(this.isUploadChange){
					setTimeout(e => {
						this.isUploadChange = false ;
					},200);
				}else{
					this.fileList = this.valueKey ? list : list.map(item => {
							return {
								url: item
							}
					});
				}
				
				this.list = this.valueKey ? list.map(item => item[this.valueKey]) : list;
			},

			getValueList: function(value, valueKey) {
				if (value !== 0 && value !== false && !value) {
					return [];
				}
				if (Array.isArray(value)) {
					return value;
				}
				if (valueKey) {
					return JSON.parse(value);
				}
				return (value + "").split(",");
			},
			
			chooseFiles:function(){
				var typeLimit = this.typeMap[this.type] ;
				var fileType = typeLimit ?  typeLimit.join(",") : '*' ;
				uni.chooseFile({
					fileType : fileType ,
					success :(res) =>{
						var name = res.file.name ;
						var size = res.file.size ;
						var path = res.path ;
						var files = [{
							path , name , size  ,
							type : res.file.type ,
							lastModified : res.file.lastModified
						}];
						
						this.totalSize = size  ;
						this.uploadSize = 0 ;
						this.files = files;
						this.doUpload(0);
					}
				});
			},
			
			chooseAudio:function(){
				var typeLimit = this.typeMap[this.type] ;
				var fileType = typeLimit ?  typeLimit.join(",") : '*' ;
				uni.chooseFile({
					fileType : fileType ,
					success :(res) =>{
						var name = res.file.name ;
						var size = res.file.size ;
						var path = res.path ;
						this.getAudioDuration(path , duration => {
							if (duration > this.maxDuration ) {
								uni.showToast({
									title:  '音频最长' + this.getMaxTimeStr() ,
									icon : 'none'
								});
								return ;
							}
							
							var files = [{
								duration , path , name , size  ,
								type : res.file.type ,
								lastModified : res.file.lastModified
							}];
							
							this.totalSize = size  ;
							this.uploadSize = 0 ;
							this.files = files;
							this.doUpload(0);
							
						});
					}
				});
			},
			
			getAudioDuration:function(url , success ){
				var audioElement = new Audio(url);
				audioElement.addEventListener("loadedmetadata", function (_event) {
					success(parseFloat(audioElement.duration.toFixed(2)));
				});
			},

			chooseImage: function(e) {
				var count = this.count > 1 ? this.count : 1;
				if (this.count == -1) {
					count = 9999;
				}
				uni.chooseImage({
					count: count,
					success: (res) => {
						var files = res.tempFiles;
						this.totalSize = files.map(item => item.size).reduce((total, size) => total + size);
						this.uploadSize = 0;
						this.files = files;
						this.doUpload(0);
					}
				});
			},
			
			getMaxTimeStr :function(){
				return this.maxDuration < 60 ? this.maxDuration + '秒' : parseInt(this.maxDuration / 60 ) + '分钟' ;
			},

			chooseVideo: function(e) {
				uni.chooseVideo({
					sourceType : this.sourceType ,
					maxDuration : this.maxDuration ,
					compressed : this.compressed ,
					camera : this.camera ,
					success: (res) => {
						var duration = res.duration;
						if (duration > this.maxDuration ) {
							uni.showToast({
								title: '视频最长' + this.getMaxTimeStr() ,
								icon: 'none'
							});
							return;
						}
						var files = [{
							duration : res.duration ,
							height : res.height ,
							width : res.width ,
							path : res.tempFilePath ,
							size : res.size ,
							type : res.tempFile.type ,
							name : res.name ,
							lastModified : res.tempFile.lastModified
						}];
						
						this.totalSize = res.size ;
						this.uploadSize = 0 ;
						this.files = files;
						this.doUpload(0);
					}
				});
			},

			doUpload: function(index) {
				if (index > this.files.length - 1 || (this.count != -1 && this.list.length >= this.count)) {
					this.files = [];
					uni.hideLoading();
					return;
				}
				var file = this.files[index];
				uniCloud.uploadFile({
					fileType : this.type ,
					filePath: file.path ,
					cloudPath: this.getCloudPath(file),
					onUploadProgress: e => {
						var percent = (((this.uploadSize + e.loaded) / this.totalSize) * 100);
						var progress = (percent > 100 ? 100 : percent).toFixed(2);
						uni.showLoading({
							title: progress + "%"
						});
						if (e.loaded == e.total) {
							this.uploadSize += e.total;
						}
					},
					success: (e) => {
						var fileId = e.fileID;
						this.list.push(fileId);
						var fileData = this.getFileData(file, fileId);
						this.fileList.push(fileData);
						this.isUploadChange = true ;
						this.changed();
						index++;
						this.doUpload(index);
					},
					fail: (err) => {
						console.log(err);
						uni.hideLoading();
						console.log("上传失败：", err);
						uni.showModal({
							title: '上传失败',
							content: JSON.stringify(err),
							showCancel: false,
							confirmColor: '#07c160'
						});
					}
				})
			},

			getFileData: function(file, fileId) {
				var fileData = {
					size: file.size,
					name: file.name,
					type: file.type,
					extends: this.getExtends(file),
					path: file.path,
					lastModified: file.lastModified
				};
				var valueKey = this.valueKey ? this.valueKey : 'url';
				fileData[valueKey] = fileId;
				if (file.duration) {
					fileData.duration = file.duration ;
				}
				if (file.width) {
					fileData.width = file.width ;
				}
				if (file.height) {
					fileData.height = file.height ;
				}
				return fileData;
			},

			guid: function() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = Math.random() * 16 | 0,
						v = c == 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
			},

			getCloudPath: function(file) {
				var fileType = this.getExtension(file);
				return `${ this.prefix ? this.prefix : this.guid()}.${fileType}`;
			},

			getExtension: function(file) {
				if(['image','audio',"video"].indexOf(this.type) > -1){
					return file.name ;
				}
				return file.name + '.png' ;
			},
			
			getExtends:function(file){
				var extension = file.name ;
				if (!extension) {
					return '' ;
				}
				return extension.substr(extension.lastIndexOf(".")+1);
			},

			remove: function(e) {
				var index = e.detail.value;
				var fileID = this.list[index];
				if (!this.deleteUrl) {
					this.list.splice(index, 1);
					var file = this.fileList[index] ;
					this.fileList.splice(index, 1);
					this.$emit("delete", {
						detail: {
							value: fileID ,
							index : index ,
							file : file
						}
					});
					this.changed();
					return;
				}
				this.deleteRemote(fileID);
			},

			deleteRemote: function(fileID, index) {
				this.bcc.call({
					url: this.deleteUrl,
					data: {
						fileID
					},
					success: res => {
						this.list.splice(index, 1);
						this.$emit("delete", {
							detail: {
								value: fileID
							}
						});
						this.changed();
					}
				});
			},

			changed: function(e) {
				this.$emit("change", {
					detail: {
						value: this.list,
						files: this.fileList
					}
				});
				var value = this.valueKey ? JSON.stringify(this.fileList) : this.list.join(",");
				this.$emit("bindModel", value);
			}
		}
	}
</script>
