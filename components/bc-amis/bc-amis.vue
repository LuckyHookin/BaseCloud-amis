<template>
	<div>
		<remote-js :src="amisJsUrl" @load-js-finish="jsLoadCallBack"></remote-js>
		<remote-css :href="amisCssUrl"></remote-css>
		<div id="amis-app"></div>
	</div>
</template>

<script>
	export default {
		components: {
			'remote-css': {
				render(createElement) {
					return createElement('link', {
						attrs: {
							href: this.href,
							rel: "stylesheet"
						}
					})
				},
				props: {
					href: {
						type: String,
						required: true
					}
				}
			},
			'remote-js': {
				render(createElement) {
					var self = this
					return createElement('script', {
						attrs: {
							type: 'text/javascript',
							src: this.src
						},
						on: {
							load: function() {
								self.$emit('load-js-finish')
							}
						}
					})
				},
				props: {
					src: {
						type: String,
						required: true
					}
				}
			}
		},
		data() {
			return {
				// 百度CDN
				// amisCssUrl: 'https://houtai.baidu.com/v2/csssdk',
				// amisJsUrl: 'https://houtai.baidu.com/v2/jssdk',
				amisCssUrl: '/static/amis-sdk/sdk.css',
				amisJsUrl: '/static/amis-sdk/sdk.js'
			}
		},
		props: {
			// JSON 配置
			schema: Object,
		},
		methods: {
			jsLoadCallBack: function() {
				window.hasAuth = this.hasAuth;
				let amis = amisRequire('amis/embed');
				// 通过替换下面这个配置来生成不同页面
				let amisScoped = amis.embed('#amis-app', this.schema, {}, {
					fetcher: ({
						url,
						method,
						data,
						config
					}) => {
						// 可以不传，用来实现 ajax 请求

						// 使用客户端上传文件
						if (url.indexOf('api/upload/image') !== -1 || url.indexOf('api/upload/file') !== -1) {
							// console.log(data.get('file'))

							// 获得 FormData 中的 File 对象，并为其创建一个 blobURL
							let blobURL = URL.createObjectURL(data.get('file'));

							return new Promise((resolve, reject) => {
								uniCloud.uploadFile({
									filePath: blobURL,
									cloudPath: data.get('file').name,
									success: res => {

										/* // 文件上传记录 api
										this.bcc.call({
											url: 'admin/file/save', //请求路径，直接以函数名称开头，开头不要加/，后面跟着路径
											data: {name:res.filePath,src:res.fileID}, //请求参数
										});
										*/

										// 释放 blobURL
										URL.revokeObjectURL(blobURL);
										resolve({
											data: {
												status: 0,
												data: {

													value: res.fileID,
													url: res.fileID,
													filename: res.filePath

												}
											}
										})
									},
									fail: res => {
										// 释放 blobURL
										URL.revokeObjectURL(blobURL);
										resolve({
											data: {
												status: -1,
												msg:'上传文件失败！'
											}
										})
									}
								});
							})

						}

						// 校验是否为外部 url(aa.bb.cc/dd)
						function checkUrl(str) {
							var RegUrl = new RegExp();
							RegUrl.compile("[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
							return RegUrl.test(str)
						}
						if (checkUrl(url)) {
							return new Promise((resolve, reject) => {
								// 请求外部 url
								uni.request({
									url: url,
									data: data,
									success: res => {
										resolve(res)
									},
									fail: res => {
										resolve(res)
									}
								})
							})
						};

						return new Promise((resolve, reject) => {
							this.bcc.call({
								url: url, //请求路径，直接以函数名称开头，开头不要加/，后面跟着路径
								data: data, //请求参数
								success: res => {
									//当服务端返回state == 'ok' 或无state字段时，进入success回调

									resolve({
										data: {
											status: 0,
											...res
										}
									})
								},
								fail: res => {
									//当服务端返回state == 'fail' 时，进入fail回调；
									//如未定义fail回调，则默认提示服务端返回的msg字段

									resolve({
										data: {
											status: -1,
											...res
										}
									})
								},
								complete: res => {
									resolve({
										data: {
											status: -1,
											msg: '无法访问请求的地址！'
										}
									})
								}
							});

						});
					}
				});
			},
			hasAuth: function(url) {
				if (!url) {
					return true;
				}
				var menuList = uni.getStorageSync("menuList") || [];
				if (menuList.length == 0) {
					console.log("未配置菜单或未登录，menuList:", menuList);
					return false;
				}

				var index = url.indexOf("?");
				if (index > -1) {
					url = url.substr(0, index);
				}
				var authIndex = menuList.findIndex(item => item.url && item.url.indexOf(url) > -1);
				if (authIndex == -1) {
					console.log("noAuth:", url);
				}
				return authIndex > -1;
			}
		},
	}
</script>
