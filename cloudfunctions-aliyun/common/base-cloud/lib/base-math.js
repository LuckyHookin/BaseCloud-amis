/**
 * @description For the convenience of updating the version, do not modify this file
 */
module.exports = {
	/**
	 * 数字相乘，至少两个，支持多个
	 */
	multiply : function (){
		var args = [...arguments];
		var number = args[0] ;
		var digit = args[1] ;
	    var m=0, s1=number.toString(), s2=digit.toString();
	    try{m+=s1.split(".")[1].length}catch(e){}
	    try{m+=s2.split(".")[1].length}catch(e){}
	    var total = Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
		args.splice(0,2,total);
		return args.length == 1 ? total : this.multiply(...args) ;
	}
}