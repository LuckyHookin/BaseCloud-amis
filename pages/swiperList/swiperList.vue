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
    "body": [
        {
            "type": "button",
            "label": "新建",
            "actionType": "dialog",
            "dialog": {
                "type": "dialog",
                "title": "新建",
                "body": [
                    {
                        "type": "form",
                        "title": "表单",
                        "controls": [
                            {
                                "label": "标题",
                                "type": "text",
                                "name": "title",
                                "required": true
                            },
                            {
                                "type": "url",
                                "label": "图像地址",
                                "name": "image",
                                "required": true
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
                                "compressOptions": {
                                }
                            },
                            {
                                "type": "text",
                                "label": "跳转地址",
                                "name": "url",
                                "required": true
                            }
                        ],
                        "api": "admin/swiperList/save"
                    }
                ]
            },
            "className": "m-b-sm"
        },
        {
            "type": "crud",
            "api": "admin/swiperList/list",
            "columns": [
                {
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
                    "buttons": [
                        {
                            "label": "编辑",
                            "type": "button",
                            "actionType": "dialog",
                            "dialog": {
                                "type": "dialog",
                                "title": "修改弹框",
                                "body": [
                                    {
                                        "type": "form",
                                        "title": "表单",
                                        "controls": [
                                            {
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
                                                "compressOptions": {
                                                }
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
                                    }
                                ],
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
            "messages": {
            },
            "initFetch": true,
            "loadDataOnce": true,
            "itemActions": [
            ],
            "bulkActions": [
            ],
            "primaryField": "_id"
        }
    ],
    "messages": {
    },
    "bodyClassName": "",
    "className": "bg-white",
    "initApi": ""
}
			}
		},
		methods:{
			
		}
	}
</script>
