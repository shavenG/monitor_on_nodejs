var SCANURL_INTERVAL = 5E3;

//扫描URL的页面的内容
//如果请求成功则将页面的html写入Links表的html字段中,并且将请求的响应代码写入status中  例如：200
//如果请求失败则输出错误连接，并且将http响应的错误代码写入status中  例如：404
function scanUrl(url) {
  console.log("执行scanUrl()方法");
  $.ajax({
    url: url,
    dataType: 'text',
    success: function(html, _, xhr) {
      console.log("Scan Success");
      var type = xhr.getResponseHeader('Content-type');
      dao.updateLinkHtml(url,html,xhr.status);
    },
    error: function(e) {
      console.log("Scan Error:",url);
      dao.updateLinkHtml(url,e.responseText,e.status);
    }
  });
}

(function(){
  //得到Links表中未扫描的url
  getScanLinks = function() {
    dao.getLinks(function(rows){
      var new_arr = [];
      while(rows.length>0){
        //将结果乱序扫描
        var random = parseInt(Math.random()*rows.length);
        var scanValue = rows.splice(random,1)[0]; //将移除结果数组中的元素返回
        scanUrl(scanValue);
      }
    });
  },
  startScan = function(){
    console.log("Is Beginning Scan Url,To execute method:startScan()");
    getScanLinks();
  }
})();

module.exports = {"startScan":function(){
    startScan();
    setInterval(startScan,SCANURL_INTERVAL);
}};
