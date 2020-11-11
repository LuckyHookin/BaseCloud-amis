/**
 * @description For the convenience of updating the version, do not modify this file
 */
const { isNull , isArray , isEmptyObject , isString } = require("./base-type");
const db = uniCloud.database();
const dbCmd = db.command;

/**
 * 根据查询参数追加查询条件
 * @param {Object} where 查询条件
 * @param {Array} keyArr 查询参数的键名列表 , 
 * 查询参数键名与数据库字段名不一致时，分别定义后使用英文逗号隔开，如：['user,userName']代表查询参数键名为user，数据库查询字段名为userName
 * @param {String} conditionKey 查询指令
 * @param {Object} params 查询参数 
 * @return {void} 根据params追加查询条件到where中
 */
function setConditions(where , keyArr , conditionKey , params ){
	isArray(keyArr) && keyArr.forEach(keys =>{
		if (!keys) {
			return ;
		}
		var arr = keys.split(",") ;
		var key = arr[0] ;
		var val = params[key] ;
		if (!isNull(val)) {
			var queryKey = arr.length > 1 ? arr[1] : arr[0] ;
			where[queryKey] = conditionKey == 'like' ? new RegExp(val) : dbCmd[conditionKey](val);
		}
	});
}

/**
 * 解析范围筛选条件的keys
 * @param {Object} keys 每组范围筛选条件，需要指定三个键名，用英文逗号分开，分别为：数据库字段名、前端查询的开始条件的键名、前端查询的结束条件的键名。只指定数据库字段名时，前端查询的开始条件的键名为 '数据库字段名Start'，前端查询的结束条件的键名为 '数据库字段名End'
 * @return {Object} { key , start , end } 返回数据库字段名、开始查询参数键名、结束查询参数键名
 * @throw 如果keys中并不是一个键名或三个键名则抛出异常
 */
function getRangeKeys(keys){
	var arr = keys.split(",") ;
	var key = arr[0] ;
	if (arr.length == 1) {
		return { key  , start : `${key}Start` , end : `${key}End` };
	}
	if (arr.length == 3) {
		return { key , start : arr[1] , end :arr[2] };
	}
	throw `分页查询条件中的${keys}配置错误，未指定数据库查询字段以及查询参数的名称`;
}

/**
 * 链接命令
 * @param {Array} cmds 多个命令 例如：[ dbCmd.gt(2) , dbCmd.lt(5) ]
 * @param {String} linkCmdName 连接命令 and | or 
 * @return {Object} 返回已链接的命令，如： dbCmd.gt(2).and( dbCmd.lt(5) ).and( dbCmd.eq(10) )...
 */
function linkAll(cmds , linkCmdName){
	return cmds.reduce( (all , item) => all[linkCmdName]( item ) );
}

/**
 * 追加范围查询条件
 * @param {Object} where 查询条件
 * @param {Array} range 范围条件，如：['startTime,startTimeStart,startTimeEnd','updateTime']
 * @param {Object} leftCmd 左边界命令，如gt
 * @param {Object} rightCmd 右边界命令，如lt
 * @param {Object} params 查询参数
 * @return {void} 不为空的查询参数，会追加查询条件到where中
 */
function setRangeCondition(where , range , leftCmd , rightCmd , params ){
	isArray(range) && range.forEach(keys=>{
		var { key , start , end } = getRangeKeys(keys);
		var linkParams = [] ;
		var startValue = params[start] ;
		var endValue = params[end] ;
		if (!isNull(startValue)) {
			linkParams.push( dbCmd[leftCmd](startValue)  ) ;
		}
		if (!isNull(endValue)) {
			linkParams.push( dbCmd[rightCmd](endValue) ) ;
		}
		if (linkParams.length > 0) {
			where[key] = linkAll(linkParams , "and") ;
		}
	})
}

// function setMultiConditon(where , multi , cmdName , _this ){
// 	if (!_this.isArray(multi)) {
// 		return ;
// 	}
// 	multi.forEach(keys=>{
// 		if (_this.isNull(keys)) {
// 			return ;
// 		}
// 		var keyArr = keys.split(",") ;
// 		var key = keyArr[0] ;
// 		var value = _this.params[key] ;
// 		if (_this.isNull(value)) {
// 			return ;
// 		}
// 		var linkParams = [] ;
// 		for (var i = 1; i < keyArr.length; i++) {
// 			linkParams.push( cmdName == 'like' ?  new RegExp( value ) : dbCmd[cmdName](value) );
// 		}
// 		if (linkParams.length > 0) {
// 			where[key] = linkAll( linkParams , "or" );
// 		}
// 	});
// }

module.exports = {
	
	/**
	 * 针对含有orderNum字段的数据表，自动生成排序
	 * @param {Object} 即将入库的data
	 * @param {Object}  collection 数据集合  
	 * @param {Object}  where 查询条件，根据哪些因素来进行排序  
	 * @param {String}  step 排序步长，默认10
	 * @param {String} key 排序字段名，默认orderNum
	 * @return void 执行完毕后，可在入参的data中获取到orderNum
	 */
	setMaxOrderNum: async function(data, collection, where , step = 10 , key = 'orderNum') {
		if (!isNull(data[key])) {
			return;
		}
		if (!isEmptyObject(where)) {
			collection = collection.where(where);
		}
		var dataInDB = this.findFirst(await collection.orderBy(key, "desc").limit(1).get());
		data[key] = null == dataInDB || isNull(dataInDB[key])  ? 1 : parseInt(dataInDB[key]) + step ;
	},
	
	/**
	 * 根据数据库查询结果，返回一条数据
	 * @param {Object} dataInDB 数据库查询结果
	 * @return {Obejct} 有数据返回json，无数据返回null 
	 */
	findFirst : function(dataInDB) {
		return dataInDB && dataInDB.data && dataInDB.data.length > 0 ? dataInDB.data[0] : null;
	},
	
	/**
	 * 根据数据库查询结果，返回数据列表
	 * @param {Object} dataInDB 数据库查询结果
	 * @return {Array} 返回数据列表，无数据返回空数组
	 */
	find : function(dataInDB) {
		return dataInDB && dataInDB.data && dataInDB.data.length > 0 ? dataInDB.data : [];
	},
	
	/**
	 * 根据主键更新一条数据
	 * @param {Object} collection 集合对象
	 * @param {Object} data 要更新的数据，必须包含_id字段
	 * @return {Number} 返回更新数据条数
	 */
	updateById: async function(collection, data) {
		var id = data._id;
		if (!id) throw "_id参数缺失";
		delete data._id;
		data.update_time = Date.now() ;
		var res = await collection.doc(id).update(data);
		data._id = id ;
		return res.updated ;
	},
	
	/**
	 * 保存或更新数据到集合中
	 * @param {Object} collection 集合对象
	 * @param {Object} data 即将保存的数据，存在_id则更新，否则保存
	 * @return {Number} 返回保存或更新影响的数据条数，保存后，data中会插入该数据在数据库中的_id字段
	 */
	save : async function(collection, data){
		if (!isNull(data._id)) {
			return await this.updateById(collection , data );
		}
		delete data._id ;
		var now = Date.now() ;
		data.create_time = now
		data.update_time = now ;
		var res = await collection.add(data);
		if (!res.id){
			 return 0 ;
		}
		data._id = res.id ;
		return 1 ;
	},
	
	/**
	 * 根据查询参数查询分页，详见文档：https://docs.base-cloud.joiny.cn/#/pages/functions/query
	 * 注意：如果使用uniCloud.baseCloud.paginate()来调用时，必须传入params参数
	 */
	paginate: async function({ collectionName , collection , params , where = {} , field = {} , pageNumber = 1, pageSize = 10 , orderBy
		, eq , like , gte , lte , gt , lt , range , rangeNeq , rangeReq , rangeLeq }){
		if (!isNull(collectionName)) {
			collection = db.collection(collectionName) ;
		}
		params = params || this.params || {} ;
		setConditions(where , like , "like" , params);
		setConditions(where , eq , "eq" , params);
		setConditions(where , gte , "gte" , params);
		setConditions(where , gt , "gt" , params);
		setConditions(where , lte , "lte" , params);
		setConditions(where , lt , "lt" , params);
		setRangeCondition(where , range , "gte" , "lte" , params);
		setRangeCondition(where , rangeNeq , "gt" , "lt" , params);
		setRangeCondition(where , rangeLeq , "gte" , "lt" , params);
		setRangeCondition(where , rangeReq , "gt" , "lte" , params);
		// setMultiConditon( where , multi , "eq" , this );
		// setMultiConditon( where , multiNeq , "neq" , this );
		// setMultiConditon( where , multiLike , "like" , this );
		
		if (isEmptyObject(where)) {
			where._id = dbCmd.exists(true); //兼容阿里云的count()查询bug
		}
		collection = collection.where(where);
		var countRes = await collection.count();
		if (!isEmptyObject(field)) {
			collection = collection.field(field) ;
		}
		if (isString(orderBy)) {
			var arr = orderBy.trim().split(",");
			for (var i = 0; i < arr.length; i++) {
				var curOrder = arr[i] ;
				var isDesc = curOrder.indexOf("desc") > -1 ;
				curOrder = curOrder.replace("desc","").replace("asc" , "").trim();
				collection = collection.orderBy(curOrder , isDesc ? 'desc' : 'asc');
			}
		}
		var list = this.find( await collection.skip( (pageNumber-1) * pageSize ).limit(pageSize).get() ) ;
		var totalRow = countRes.total ;
		return this.getPage({ pageNumber , pageSize , totalRow , list });
	},
	
	/**
	 * 获取标准分页结构
	 * @param {Object} 
	   * 	  {Number} pageNumber 页码
	   * 	  {Number} pageSize 每页数据条数	
	   * 	  {Number} totalRow 数据总条数
	   * 	  {Array} list 当前页数据，与dateInDB二选一传入
	   * 	  {Object} dataInDB 当前页数据的数据库查询结果，与list二选一传入即可
	 * @return {Object} 返回标准分页结构数据
	 */
	getPage: function({ pageNumber , pageSize , totalRow , list , dataInDB }){
		if ( !isArray(list) && !isEmptyObject(dataInDB) ) {
			list = this.find( dataInDB ) ;
		}
		var totalPage = Math.ceil(totalRow/pageSize) ;
		return {
			list ,
			pageNumber ,
			pageSize ,
			totalRow ,
			totalPage ,
			lastPage : pageNumber == totalPage ,
			firstPage : pageNumber == 1 
		};
	},
	
	/**
	 * 在存入数据之前，判断数据是否重复
	 * @param {Object} dataInDB 根据查询条件查询的数据库中的记录，可为空
	 * @param {String} _id 即将要存入数据库中的数据的id，可为空
	 * @return {Boolean} 是否为重复数据
	 */
	isRepeat:function( dataInDB , _id ){
		return null != dataInDB &&  ( isNull(_id)  || ( _id != dataInDB._id )) ;
	},
}