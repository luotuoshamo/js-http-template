# 概述
* 使用该工具用于在JS中发HTTP请求
* 语法基于ES6

# 使用
1. 引入js
```html
<script src="plugin/http-template-1.0.0-dev.js"></script>
```
2. 发请求：
```html
let url = "/login/login"
let headObj = {}
let textParamObj = {name: loginName, pwd: loginPwd}
let binaryParamObj = {}
let res = HttpTemplate.postFormData(url, headObj, textParamObj, binaryParamObj)

let status = httpRequest.status
if(status == "200"){
	let responseTextObj = JSON.parse(res.responseText)
	console.log(responseTextObj)
}else{
	alert("请求失败")
}
```

# 返回结果
所有API的返回结果都一样：object类型，结构如下：
```html
 {
        status: httpRequest.status,
        responseText: httpRequest.responseText,
        responseURL: httpRequest.responseURL
 }
```

# API
## get 
同步 `get(url, headObj, textParamObj)`
异步`更新中`
## postFormData
同步 `postFormData(url, headObj, textParamObj, binaryParamObj)`
异步`更新中`
## postFormUrlEncoded
同步 `postFormUrlEncoded(url, headObj, textParamObj)`
异步`更新中`
## postJson
同步 `postJson(url, headObj, jsonString)`
异步`更新中`
## postXml
同步 `postXml(url, headObj, xmlString)`
异步`更新中`