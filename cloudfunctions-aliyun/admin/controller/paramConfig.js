/**
 * v2.1.3
 */
'use strict';
const db = uniCloud.database();
const dbCmd = db.command ;
const $ = db.command.aggregate ;
const ParamConfig = db.collection("t_param_config");
const PARAMS_OPTIONS = [
	{title : "操作日志保留天数" , value : "LOG_REMAIN_DAYS"}
];

module.exports = {
	info : async function(e){
		var id = this.params.id ;
		var options = PARAMS_OPTIONS ;
		if (!id) {
			return {options};
		}
		var data = this.findFirst(await ParamConfig.doc(id).get() );
		return { data , options};
	},
	
	save : async function(e){
		var data = this.getModel();
		var ex = this.findFirst(await ParamConfig.doc(data._id).get() );
		data.updateTime = Date.now() ;
		if (null == ex) {
			await ParamConfig.add(data);
		}else{
			await this.updateById(ParamConfig , data);
		}
		return this.ok();
	},
	
	delete : async function(e){
		var {id} = this.params ;
		await ParamConfig.doc(id).remove();
		return this.ok();
	},
	
	list : async function(res){
		var list = this.find(await ParamConfig.get());
		return {list};
	}
};