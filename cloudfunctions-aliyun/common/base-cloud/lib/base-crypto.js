/**
 * @description For the convenience of updating the version, do not modify this file
 */
const crypto = require('crypto');
const fs = require("fs");

/**
 * @param {String} type
 * @param {String | Buffer} originString 
 */
function hash( type , originString){
	const hash = crypto.createHash(type);
	hash.update(originString);
	return hash.digest('hex');
}

module.exports = {
	
	/**
	 * MD5加密
	 *  @param {String | Buffer} originString 
	 */
	md5 : function(originString){
		return hash('md5' , originString) ;
	},
	
	/**
	 * sha1加密
	 * @param {String | Buffer} originString
	 */
	sha1 : function(originString){
		return hash('sha1' , originString) ;
	},
	
	hmac : function(originString , secretKey){
		const hmac = crypto.createHmac('sha256', secretKey );
		hmac.update(originString);
		return hmac.digest("hex");
	},
	
	/**
	 * AES加密
	 * @param {String} originString
	 * @param {String} secretKey
	 */
	aesEncrypt : function (originString, secretKey) {
	    const cipher = crypto.createCipher('aes192', secretKey);
	    var crypted = cipher.update(originString, 'utf8', 'hex');
	    return crypted + cipher.final('hex');
	},
	
	/**
	 * AES解密
	 * @param {Object} encrypted
	 * @param {Object} key
	 */
	aesDecrypt : function (encrypted, secretKey) {
	    const decipher = crypto.createDecipher('aes192', secretKey);
	    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
	    return decrypted + decipher.final('utf8');
	}
}