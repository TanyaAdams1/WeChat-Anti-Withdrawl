const _location = window.location.toString();
let query_str_raw = _location.substring(_location.indexOf("?"), _location.length - 1);
let query = query_str_raw.split("&");
for (let i = 0; i < query.length; i++)
    if (query[i].indexOf("url=") !== -1) {
        let http_raw = query[i].split("=")[1];
        let http = decodeURIComponent(http_raw);
        setTimeout(window.location = http, 1000)
    }
