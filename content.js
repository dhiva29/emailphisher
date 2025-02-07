document.addEventListener("mouseup",function(event) {
    var sel = window.getSelection().toString();
    chrome.extension.sendRequest({"message":"text","data": sel},function(response){});
});