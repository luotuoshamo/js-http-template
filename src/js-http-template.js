let JsHttpTemplate = new Object()
HttpSender100.get = get;
HttpSender100.postFormData = postFormData;
HttpSender100.postFormUrlEncoded = postFormUrlEncoded;
HttpSender100.postJson = postJson;
HttpSender100.postXml = postXml;

const DEFAULT_CHARSET = "UTF-8";

function get(url, headObj, textParamObj) {
    let method = "GET";
    let charset = getCharsetFromHeadObj(headObj);
    let httpRequest = new XMLHttpRequest();

    logRequestMeta(url, method, charset, null, headObj);
    logRequestParam(textParamObj, null, null);

    // 参数
    let queryString = objectToQueryString(textParamObj);
    if (url.indexOf("&") != -1) url += ("&" + queryString);
    else url += ("?" + queryString);
    httpRequest.open(method, url, false);

    // 请求头
    // 必需放在httpRequest.open()之后，否则报错：
    // Failed to execute 'setRequestHeader'
    // on 'XMLHttpRequest': The object's state must be OPENED.
    setRequestHead(httpRequest, headObj);
    httpRequest.send();

    let resObj = packResponse(httpRequest);
    logResponse(resObj);
    return resObj
}

function postFormData(url, headObj, textParamObj, binaryParamObj) {
    let method = "POST";
    let bodyType = "form-data";
    let charset = getCharsetFromHeadObj(headObj);
    let formData = new FormData();
    let httpRequest = new XMLHttpRequest();
    httpRequest.open(method, url, false);

    logRequestMeta(url, method, charset, bodyType, headObj);
    logRequestParam(textParamObj, binaryParamObj, null);

    // 请求头
    setRequestHead(httpRequest, headObj);

    // 请求体-文本参数
    for (let k in textParamObj) formData.append(k, textParamObj[k]);

    // 请求体-二进制参数
    for (let k in binaryParamObj) formData.append(k, binaryParamObj[k]);

    httpRequest.send(formData);
    let resObj = packResponse(httpRequest);
    logResponse(resObj);
    return resObj
}

function postFormUrlEncoded(url, headObj, textParamObj) {
    let method = "POST";
    let bodyType = "x-www-form-urlencoded";
    let charset = getCharsetFromHeadObj(headObj);
    let httpRequest = new XMLHttpRequest();
    httpRequest.open(method, url, false);

    logRequestMeta(url, method, charset, bodyType, headObj);
    logRequestParam(textParamObj, null, null);

    // 请求头
    httpRequest.setRequestHeader("content-type", bodyType + ";charset=" + charset);
    setRequestHead(httpRequest, headObj);

    // 请求体
    let queryString = objectToQueryString(textParamObj);
    httpRequest.send(queryString);

    let resObj = packResponse(httpRequest);
    logResponse(resObj);
    return resObj
}

function postJson(url, headObj, jsonString) {
    return postRow(url, "application/json", headObj, jsonString)
}

function postXml(url, headObj, xmlString) {
    return postRow(url, "application/xml", headObj, xmlString)
}

/**
 * @param bodyType json、xml
 */
function postRow(url, bodyType, headObj, rowString) {
    let method = "POST";
    let charset = getCharsetFromHeadObj(headObj);
    let httpRequest = new XMLHttpRequest();
    httpRequest.open(method, url, false);

    logRequestMeta(url, method, charset, bodyType, headObj);
    logRequestParam(null, null, rowString);

    // 请求头
    httpRequest.setRequestHeader("content-type", bodyType + ";charset=" + charset);
    setRequestHead(httpRequest, headObj);

    // 请求体
    httpRequest.send(rowString);

    let resObj = packResponse(httpRequest);
    logResponse(resObj);
    return resObj
}

/////////////////////////////////////
/**
 * 将Object转成queryString
 *
 * 例如：将{name:wjh,gender:male} 转成 name=wjh&gender=male
 */
function objectToQueryString(obj) {
    if (!obj) return
    let queryString = "";
    for (let k in obj) {
        queryString += (k + '=' + obj[k] + '&')
    }
    return queryString.substring(0, queryString.length - 1)
}

/**
 * 设置请求头
 */
function setRequestHead(httpRequest, headObj) {
    if (!httpRequest) return;
    if (!headObj) return;
    for (let k in headObj) {
        httpRequest.setRequestHeader(k, headObj[k])
    }
}

/**
 * 记日志-请求的基本信息
 */
function logRequestMeta(url, method, charset, bodyType, headObj) {
    console.log("=====请求开始=====");
    console.log("==request meta: ");
    console.log("url", url);
    console.log("method", method);
    console.log("bodyType", bodyType);
    console.log("headObj", headObj)
}

/**
 * 记日志-请求参数
 */
function logRequestParam(textParamObj, binaryParamObj, row) {
    console.log("==request param: ");
    console.log("textParamObj", textParamObj);
    console.log("binaryParamObj", binaryParamObj);
    console.log("row", row)
}

/**
 * 记日志-响应
 */
function logResponse(resObj) {
    console.log("==response: ");
    console.log("resObj", resObj);
    console.log("=====请求结束=====")
}

/**
 * 封装响应
 */
function packResponse(httpRequest) {
    return {
        status: httpRequest.status,
        responseText: httpRequest.responseText
    }
}

/**
 * 从headObj中获取charset，如果没有获取到返回UTF-8
 * 就是从content-type中提取charset
 * 例如：content-type=application/json;charset=UTF-8
 */
function getCharsetFromHeadObj(headObj) {
    if (!headObj || headObj.length == 0) return DEFAULT_CHARSET;
    for (let k in headObj) {
        if ("content-type" == (k.toLowerCase())) {
            let v = headObj[k];
            let split = v.split(";");
            if (split.length != 2) return DEFAULT_CHARSET;
            return split[1].split("=")[1]
        }
    }
    return DEFAULT_CHARSET
}