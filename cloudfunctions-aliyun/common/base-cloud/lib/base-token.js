/**
 * @description For the convenience of updating the version, do not modify this file
 */
const {md5} = require("./base-crypto") ;
const {findFirst} = require("./base-database") ;
const jwt = require("./jwt-simple");
const User = uniCloud.database().collection("uni-id-users");

/**
 * 获取客户端User-Agent
 */
function getClientUaHash () {
	const hashContent = /MicroMessenger/i.test(__ctx__.CLIENTUA) ? __ctx__.CLIENTUA.replace(/(MicroMessenger\S+).*/i, '$1') : __ctx__.CLIENTUA
    return md5(hashContent);
}

/**
 * 创建token
 * @param {Object} config
 * @param {Object} uid
 */
function createToken(  uid  , config ) {
	var tokenExpired = Date.now() + config.tokenExpiresIn * 1000
	var signContent = { uid , exp : tokenExpired/1000 } ;
	if (config.bindTokenToDevice) {
		var hashContent = /MicroMessenger/i.test(__ctx__.CLIENTUA) ? __ctx__.CLIENTUA.replace(/(MicroMessenger\S+).*/i, '$1') : __ctx__.CLIENTUA
		signContent.clientId = md5(hashContent);
	}
	var token = jwt.encode( signContent, config.tokenSecret, 'HS256' , {
	  expiresIn: config.tokenExpiresIn
	});
	return {
	  token,
	  tokenExpired
	}
}

/**
 *@description 筛选已过期的token
 * @param {Array} tokenList
 */
function getExpiredToken (tokenList , config ) {
  const tokenExpired = []
  tokenList.forEach(token => {
    try {
      jwt.decode(token, config.tokenSecret)
    } catch (error) {
      tokenExpired.push(token)
    }
  })
  return tokenExpired
}

async function checkToken ( token , config ) {
	try {
	  const payload = jwt.decode(token, config.tokenSecret ) ;
	  if ( config.bindTokenToDevice && payload.clientId !== getClientUaHash()) {
		return {
		  code: 30201,
		  msg: 'token不合法，请重新登录'
		}
	  }
	  var uid = payload.uid
	  const userInfo = findFirst(await User.doc(uid).get()) ;
	  if ( null == userInfo || !userInfo.token) {
		return {
		  code: 30202,
		  msg: 'token不合法，请重新登录'
		}
	  }
	  if (userInfo.status === 1) {
		return {
		  code: 10001,
		  msg: '账号已禁用'
		}
	  }
	  let tokenList = userInfo.token
	  if (typeof tokenList === 'string') {
		tokenList = [tokenList]
	  }
	  if (tokenList.indexOf(token) === -1) {
		return {
		  code: 30202,
		  msg: 'token不合法，请重新登录'
		}
	  }
	
	var result = {
		code: 0,
		msg: 'token校验通过',
		userInfo ,
		uid 
	  }
	
	 // 达到设置的token过期阈值，需要重新下发一个token
	    if (config.tokenExpiresThreshold && payload.exp - Date.now() / 1000 < config.tokenExpiresThreshold) {
	      const newTokenInfo = createToken(uid , config)
	      // 去除过期token防止文档过大
	      const expiredToken = getExpiredToken(tokenList)
	      tokenList = tokenList.filter(item => expiredToken.indexOf(item) === -1 )
	      tokenList.push(newTokenInfo.token)
	      await User.doc(uid).update({
	        token: tokenList
	      })
	      return {
	        ...result,
	        ...newTokenInfo
	      }
	    }
		
	  uniCloud.logger.log('checkToken payload', payload)

	  return result 
	  
	} catch (err) {
		console.log(err);
	  if (err.name === 'TokenExpiredError') {
		return {
		  code: 30203,
		  msg: 'token已过期，请重新登录',
		  err: err
		}
	  }

	  return {
		code: 30204,
		msg: '非法token',
		err: err
	  }
	}
}

module.exports = {
	checkToken ,
	createToken
}

