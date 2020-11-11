/**
 * @param {Object} options
 * size 
 * fileType
 * success
 */
// #ifdef H5
uni.chooseFile = function(options , that){
	let emptyFun = function(){};
	let success = options.success || emptyFun ; 
	
	var input = document.createElement('input');
	input.type = 'file';
	
	if(options.fileType){
		input.accept = options.fileType ;
	}
	input.style.display = 'none';
	input.id = 'file' ;
	input.onchange = (event) => {
		// 上传附件 获取文件信息
		var fileinfo = event.target.files[0];
		var localPath = event.target.value ;
		var size = fileinfo.size ;
		if(options.size && options.size < size){
			uni.showToast({
				title: '文件大小超过限制',
				icon : 'none'
			});
			input.value = '' ;
			return false ;
		}
		
		success({
			file : fileinfo ,
			path : URL.createObjectURL(fileinfo)
		});
		return false ;
		
		var reader = new FileReader();
		reader.readAsDataURL(fileinfo);
		reader.onload = function(e) {
			success({
				file : fileinfo ,
				path : e.target.result
			});
		}
	}
	document.body.appendChild(input);
	input.click();
	// that.$refs.input.$el.appendChild(input);
}
// #endif