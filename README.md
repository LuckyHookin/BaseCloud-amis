**学生小白，大佬轻喷～**

basecloud 框架地址：[BaseCloud - 云开发全栈极速开发框架](https://ext.dcloud.net.cn/plugin?id=2481)

百度 amis 是一个通过 json 配置渲染页面的前端框架，可以减少页面开发工作量，极大提升效率。还提供可视化编辑器。文档：[amis - 低代码前端框架](https://baidu.gitee.io/amis/docs/index)

# BaseCloud amis 组件

对百度 amis 作简单的配置，使其可以用在 BaseCloud 框架中。

amis 可视化编辑器：[AMIS 页面](https://fex-team.github.io/amis-editor-demo/)

在线示例：[BaseCloud](https://static-06fa519a-c7ae-418d-b4d4-87e01654cdaf.bspapp.com/#/pages/menu/menuList) 账号：admin，密码：123123123

![](https://i.loli.net/2020/11/11/z7aWmpe5KoYxMEk.png "示例1")

可视化编辑器：

![](https://i.loli.net/2020/11/12/E2JIK6xAfbwFpQL.png)

示例中的轮播图页面，把在可视化编辑器中配置好的 json 代码放在 `schema` 变量中即可呈现：

```html
<!--/pages/swiperList/swiperList-->
<template>
    <layout pageKey="swiperList" :innerScroll="false">
        <bc-amis :schema="schema"></bc-amis>
    </layout>
</template>

<script>
    export default {
        data() {
            return {
                schema: {
                    "type": "page",
                    "title": "轮播图",
                    "body": [{
                            "type": "button",
                            "label": "新建",
                            "actionType": "dialog",
                            "dialog": {
                                "type": "dialog",
                                "title": "新建",
                                "body": [{
                                    "type": "form",
                                    "title": "表单",
                                    "controls": [{
                                            "label": "标题",
                                            "type": "text",
                                            "name": "title"
                                        },
                                        {
                                            "type": "url",
                                            "label": "图像地址",
                                            "name": "image"
                                        },
                                        {
                                            "type": "image",
                                            "label": "图片上传",
                                            "name": "image",
                                            "imageClassName": "r w-full",
                                            "multiple": false,
                                            "reciever": "/api/upload/image",
                                            "accept": ".jpeg, .jpg, .png, .gif",
                                            "hideUploadButton": true,
                                            "autoUpload": true,
                                            "compress": false,
                                            "compressOptions": {}
                                        },
                                        {
                                            "type": "text",
                                            "label": "跳转地址",
                                            "name": "url"
                                        }
                                    ],
                                    "api": "admin/swiperList/save"
                                }]
                            },
                            "className": "m-b-sm"
                        },
                        {
                            "type": "crud",
                            "api": "admin/swiperList/list",
                            "columns": [{
                                    "type": "image",
                                    "label": "图片展示",
                                    "name": "image"
                                },
                                {
                                    "name": "title",
                                    "label": "标题",
                                    "type": "text"
                                },
                                {
                                    "type": "text",
                                    "name": "url",
                                    "label": "跳转地址"
                                },
                                {
                                    "type": "operation",
                                    "label": "操作",
                                    "buttons": [{
                                            "label": "编辑",
                                            "type": "button",
                                            "actionType": "dialog",
                                            "dialog": {
                                                "type": "dialog",
                                                "title": "修改弹框",
                                                "body": [{
                                                    "type": "form",
                                                    "title": "表单",
                                                    "controls": [{
                                                            "type": "text",
                                                            "label": "标题",
                                                            "name": "title"
                                                        },
                                                        {
                                                            "type": "url",
                                                            "label": "图像地址",
                                                            "name": "image"
                                                        },
                                                        {
                                                            "type": "image",
                                                            "label": "图片上传",
                                                            "name": "image",
                                                            "imageClassName": "r w-full",
                                                            "multiple": false,
                                                            "reciever": "/api/upload/image",
                                                            "accept": ".jpeg, .jpg, .png, .gif",
                                                            "hideUploadButton": true,
                                                            "autoUpload": true,
                                                            "compress": false,
                                                            "compressOptions": {}
                                                        },
                                                        {
                                                            "type": "text",
                                                            "label": "跳转地址",
                                                            "name": "url",
                                                            "visible": false,
                                                            "visibleOn": ""
                                                        },
                                                        {
                                                            "type": "text",
                                                            "label": "id",
                                                            "name": "_id",
                                                            "visible": false,
                                                            "visibleOn": ""
                                                        }
                                                    ],
                                                    "api": "admin/swiperList/save"
                                                }],
                                                "closeOnEsc": false,
                                                "showCloseButton": true
                                            },
                                            "visible": "",
                                            "visibleOn": "hasAuth('admin/swiperList/save')"
                                        },
                                        {
                                            "type": "button",
                                            "label": "删除",
                                            "actionType": "ajax",
                                            "dialog": {
                                                "title": "系统提示",
                                                "body": "对你点击了"
                                            },
                                            "level": "danger",
                                            "api": "admin/swiperList/delete",
                                            "visibleOn": "hasAuth('admin/swiperList/delete')"
                                        }
                                    ]
                                }
                            ],
                            "messages": {},
                            "initFetch": true,
                            "loadDataOnce": true,
                            "itemActions": [],
                            "bulkActions": [],
                            "primaryField": "_id"
                        }
                    ],
                    "messages": {},
                    "bodyClassName": "",
                    "className": "bg-white"
                }
            }
        },
        methods: {

        }
    }
</script>
```

## 约定

- 文件上传接口可用：
  
  1. `api/upload/image`
  
  2. `api/upload/file`

以上两个接口可触发客户端文件上传 `uniCloud.uploadFile()`。

- 用户鉴权函数为 `hasAuth(’云函数路径‘)`
  
  可以在组件的显示和隐藏配置中以表达式的方式填写：
  
  ```
  hasAuth('admin/swiperList/save')
  ```
  
  ![](https://i.loli.net/2020/11/11/2AQ7TK3cUFkWsjJ.png)

## 注意事项

- 由于 amis 本身的关系，组件只支持 h5，移动端和 pc 都行。

- **重要！** 客户端 `common/js/base-cloud-client.js` 请使用 [gitee](https://gitee.com/phoooob/BaseCloud)上的最新版本，作者还没同步更新到插件市场。

- 云函数的返回格式要统一：
  
  ```js
  {
    "status": 0,
    "msg": "",
    "data": {
      ...其他字段
    }
  }
  ```
  
  - **status**: 返回 `0`，表示当前接口正确返回，否则按错误请求处理，**bc-amis 组件会根据请求的成功与否（state == 'ok'）自动添加。**
  
  - **msg**: 返回接口处理信息，主要用于表单提交或请求失败时的 `toast` 显示；
  
  - **data**: 必须返回一个具有 `key-value` 结构的对象。
  
  如 CRUD amis 组件的返回格式要求：
  
  ```js
  {
    "status": 0,
    "msg": "",
    "data": {
      "items": [
        {
          // 每一行的数据
          "id": 1,
          "xxx": "xxxx"
        }
      ],
  
      "total": 200 // 注意！！！这里不是当前请求返回的 items 的长度，而是数据库中一共有多少条数据，用于生成分页组件
      // 如果你不想要分页，把这个不返回就可以了。
    }
  }
  ```
  
  云函数返回示例：
  
  ```js
      // 文件路径：cloudfunctions-aliyun/admin/controller/swiperList.js
      // API 接口：admin/swiperList/list
      list : async function(res){
          var dataInDB = await swiperList.field({
              "image" : 1 ,
              "title" : 1 ,
              "url" : 1 
          }).get() ;
          var list = this.find( dataInDB );
          return {data:{items:list}};
      }
  ```
  
  具体请看：[amis - 低代码前端框架](https://baidu.gitee.io/amis/docs/types/api)

- 示例目录：
  
  ```
  .
  │  App.vue
  │  LICENSE
  │  main.js
  │  manifest.json
  │  package.json
  │  pages.json
  │  README.md
  │  uni.scss
  │
  ├─cloudfunctions-aliyun
  │  │  cloudfunctions_init.json
  │  │  db_init.json  // 数据库初始化文件
  │  │
  │  ├─admin
  │  │  │  index.js
  │  │  │  package.json
  │  │  │
  │  │  └─controller
  │  │          menu.js
  │  │          operateLog.js
  │  │          paramConfig.js
  │  │          role.js
  │  │          swiperList.js  // 示例
  │  │
  │  │ ...
  │  └─
  │
  ├─components
  │  ├─alerts
  │  │      alerts.vue
  │  │
  │  ├─auth
  │  │      auth.vue
  │  │
  │  ├─auth-btn
  │  │      auth-btn.vue
  │  │
  │  ├─auth-nav
  │  │      auth-nav.vue
  │  │
  │  ├─bc-amis
  │  │      bc-amis.vue  // BaesCloud amis 组件
  │  │
  │  │ ...
  │  └─
  │
  ├─pages
  │  ├─login
  │  │      login.vue
  │  │
  │  ├─menu
  │  │      menuList.vue
  │  │
  │  ├─operateLog
  │  │      operateLogList.vue
  │  │
  │  ├─paramConfig
  │  │      paramConfigEdit.vue
  │  │      paramConfigList.vue
  │  │
  │  ├─role
  │  │      roleEdit.vue
  │  │      roleList.vue
  │  │
  │  ├─setting
  │  │      setting.vue
  │  │
  │  ├─swiperList
  │  │      swiperList.vue  // 示例
  │  │
  │  └─user
  │          userEdit.vue
  │          userList.vue
  │
  ├─static
  │  │  loginBg.png
  │  │  logo.jpg
  │  │  logoText.png
  │  │  logoTextLight.png
  │  │
  │  └─amis-sdk  // !!记得附带
  │      │  sdk.css
  │      │  sdk.js
  │      │  ...
  │      └─
  │
  │ ...
  └─
  ```
