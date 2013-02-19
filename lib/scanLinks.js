var SCANURL_INTERVAL = 5E3;
// var complete_running = true;

//扫描URL的页面的内容
//如果请求成功则将页面的html写入Links表的html字段中
//如果请求失败则输出错误
function scanUrl(url) {
  console.log("执行scanUrl()方法");
  $.ajax({
    url: url,
    dataType: 'text',
    success: function(html, _, xhr) {
      console.log("Scan Success");
      var type = xhr.getResponseHeader('Content-type');
      dao.updateLinkHtml(url,html);
    },
    error: function(e) {
      // console.log(e);
      console.log("Scan Error:",url);
      dao.updateLinkHtml(url,"无法访问页面");
    }
  });
}

(function(){
  //得到Links表中未扫描的url
  getScanLinks = function() {
    // console.log("执行getScanLinks()方法");
    dao.getLinks(function(rows){
      for(var i = rows.length-1;i>=0;i--){
        if(rows[i] != ""){
          scanUrl(rows[i]);
        }
        rows.pop(i);
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
