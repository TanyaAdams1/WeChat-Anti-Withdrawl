
const OriginalXMLHttpRequest = XMLHttpRequest;
OriginalXMLHttpRequest.prototype = XMLHttpRequest.prototype;


XMLHttpRequest = function () {
    this.original_xhr = new OriginalXMLHttpRequest();
    this.upload = this.original_xhr.upload;
};
XMLHttpRequest.prototype.open = function (method, url) {
    this.original_xhr.open(method, url);
};
XMLHttpRequest.prototype.setRequestHeader = function (e, t) {
    this.original_xhr.setRequestHeader(e, t)
};
XMLHttpRequest.prototype.getAllResponseHeaders = function () {
    return this.original_xhr.getAllResponseHeaders();
};
XMLHttpRequest.prototype.send = function (data) {
    this.original_xhr.send(data);
    let outer_xhr = this;
    this.original_xhr.onreadystatechange = function (event) {
        outer_xhr.responseText = filter(this.responseText);
        outer_xhr.readyState = this.readyState;
        outer_xhr.status = this.status;
        outer_xhr.statusText = this.statusText;
        try {
            outer_xhr.onreadystatechange(event)
        }
        finally {
        }
    }
};
XMLHttpRequest.prototype.abort = function () {
    this.original_xhr.abort();
};

function filter(text) {
    try {
        let origin_response = JSON.parse(text);
        if (origin_response.AddMsgCount === 0)
            return text;
        for (let i = 0; i < origin_response.AddMsgCount; i++)
            if (test_withdrawl(origin_response.AddMsgList[i]))
                origin_response.AddMsgList.splice(i, 1);
        origin_response.AddMsgCount = origin_response.AddMsgList.length;
        return JSON.stringify(origin_response);
    } catch (e) {
        return text
    }
}

function test_withdrawl(msg) {
    return msg.MsgType === 10002 && msg.Status === 4 && msg.SubMsgType === 0;
}