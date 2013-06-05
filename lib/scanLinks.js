var urlm = require('url');
var SCANURL_INTERVAL = 1000 * 60 * 0.05;

//扫描URL的页面的内容
//如果请求成功则将页面的html写入Links表的html字段中,并且将请求的响应代码写入status中  例如：200
//如果请求失败则输出错误连接，并且将http响应的错误代码写入status中  例如：404
function scanUrl(url,par) {
  $.ajax({
    url: url,
    dataType: 'text',
    success: function(html, _, xhr) {
      getLinkToDb();
      getDetailInfo(html,url,par,xhr.status);
    },
    error: function(e) {
      getLinkToDb();
      dao.updateLinkHtml(url,e.responseText,e.status||999,{});
      console.log("扫描子连接“",url,"”出现异常，错误代码：",e.status||999,",错误信息：",e.statusText);
    },
    timeout: 30000
  });
}

//获取提取页面细节
function getDetailInfo(html,url,par,status) {
  dao.getPage({url:par},function(page){
    var doc =$(BG.getStrippedBody(html));
    //页面配置信息的默认值
    var result_obj = {
      content:BG.cleanContent(doc.find('body').html()),
      keyword:page.keyword_mode,
      time:Date.now()
    };
    for(var key in page)
    {
      var ki = key.indexOf('_mode');
      if(ki > 0)
      {
        var name = key.substr(0, ki);
        if(page[key] == "regex")
        {
          result_obj[name] = BG.findAndFormatRegexMatches(html,page[name+'_regex'],function(){});
          result_obj[name] = BG.cleanContent(result_obj[name]);
        }
        else if(page[key] == "selector")
        {
          result_obj[name] = BG.findAndFormatSelectorMatches(html,page[name+'_selector'],function(){});
          result_obj[name] = BG.cleanContent(result_obj[name]);
        }
      }
    }
    for(var t in result_obj) {
      if(result_obj[t] == null || result_obj[t] == "") {
        delete(result_obj[t]);
      }
    }
    dao.updateLinkHtml(url, html, status,result_obj, function(){});
  });
}

var pool = [];
function getLinkToDb(){
  if(pool.length > 0){
    var random = parseInt(Math.random()*pool.length);
    var scanValue = pool.splice(random,1)[0]; //将移除结果数组中的元素返回
    scanUrl(scanValue.url,scanValue.parent);
  }
  else{
    setTimeout(getLinkToDb,3000);
  }
}

//得到Links表中未扫描的url
function getScanLinks() {
  if(pool.length<MAX_CONNECT_COUNT*2) {
    dao.getLinks(function(rows){
    if(rows.length > 0){
        pool = pool.concat(rows);
      }
      setTimeout(getScanLinks,6000);
       // console.log("连接池中连接数添加了",rows.length,"至：",pool.length);
    });
  }else {
    setTimeout(getScanLinks,6000);
    // console.log("连接池重置，连接池连接数为：",pool.length);
  }

};

module.exports = {
  "startScan":function(){
    for(var i=0; i<MAX_CONNECT_COUNT; i++){
      getLinkToDb();
    }
    getScanLinks();
  }
};
