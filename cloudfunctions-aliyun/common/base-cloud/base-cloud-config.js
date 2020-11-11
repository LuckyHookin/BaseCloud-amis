const loginInter = require("./intercepters/loginInter") ;
const authInter = require("./intercepters/authInter") ;

module.exports = {
	isDebug : true , //会输出一些日志到控制台，方便调试
	inters:{ //注册拦截器
		loginInter, //用户登录拦截
		authInter , //管理权限拦截
		closeInter : { //指定路由关闭外部访问
			handle : [/^curl\/private/] , //只拦截URL化的云函数curl,以curl/private开头的路由
			invoke : async function(){
				return { state : "access denied" , msg : '禁止访问' } ;
			}
		}
	},
	alwaysState : true , //响应结果中没有state状态描述时，默认为ok，自动追加state:ok,msg:'操作成功'；业务函数返回true或undefined，表示ok，业务函数返回false表示fail
	dataKey : '' , //开启默认响应结果后，可通过指定dataKey来定义业务函数返回数据的键名（不推荐，建议仅供有特定数据结构需求时使用），如不指定dataKey，则默认与state同级合并。
	uniId : { //uni-id配置项，参阅uni-id文档：https://uniapp.dcloud.io/uniCloud/uni-id
		"tokenExpiresThreshold" : 600 , // 新增于uni-id 1.1.7版本，checkToken时如果token有效期小于此值则自动获取新token，请注意将新token返回给前端保存，如果不配置此参数则不开启自动获取新token功能
		"passwordSecret": "655bf092db0febee2df029d38914b42597c3edbe",
		"tokenSecret": "5f2cbefb6efa310001a706b5", // 生成token所用的密钥，注意修改为自己的
		"tokenExpiresIn": 7200, // 全平台token过期时间，未指定过期时间的平台会使用此值
		"passwordErrorLimit": 6, // 密码错误最大重试次数
		"passwordErrorRetryTime": 3600,  // 密码错误重试次数超限之后的冻结时间
		"bindTokenToDevice": false , // 是否将token和设备绑定，设置为true会进行ua校验
		"autoSetInviteCode": false,  // 是否在用户注册时自动设置邀请码，默认不自动设置
		"forceInviteCode": false, // 是否强制用户注册时必填邀请码，默认为false（需要注意的是目前只有短信验证码注册才可以填写邀请码）
		"app-plus": {
			"tokenExpiresIn": 2592000 ,
			"oauth": {
				// App微信登录所用到的appid、appsecret需要在微信开放平台获取，注意：不是公众平台而是开放平台
				"weixin": {
					"appid": "weixin appid",
					"appsecret": "weixin appsecret"
				}
			}
		},
		"mp-weixin": {
			"oauth": {
				// 微信小程序登录所用的appid、appsecret需要在对应的小程序管理控制台获取
				"weixin": {
					"appid": "weixin appid",
					"appsecret": "weixin appsecret"
				}
			}
		},
		"mp-alipay": {
			"oauth": {
				// 支付宝小程序登录用到的appid、privateKey请参考支付宝小程序的文档进行设置或者获取，https://opendocs.alipay.com/open/291/105971#LDsXr
				"alipay": {
					"appid": "alipay appid",
					"privateKey": "alipay privateKey"
				}
			}
		},
		"service": {
			"sms": {
				"name" : "your app name" ,
				"verifyCodeTemplateId": "your templateId", // 验证码短信模板ID，需提前申请：https://dev.dcloud.net.cn/uniSms/tmp，模板内容：验证码：${code}，用于${action}，${expMinute}分钟内有效，请勿泄露并尽快验证。
				"codeExpiresIn": 180, // 验证码过期时间，单位为秒，注意一定要是60的整数倍
				"smsKey": "your sms key", // 短信密钥key，开通短信服务处可以看到
				"smsSecret": "your sms secret" // 短信密钥secret，开通短信服务处可以看到
			}
		}
	}
}