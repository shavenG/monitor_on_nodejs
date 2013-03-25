var urlm = require('url');
var SCANURL_INTERVAL = 1000 * 60 * 10;


//扫描URL的页面的内容
//如果请求成功则将页面的html写入Links表的html字段中,并且将请求的响应代码写入status中  例如：200
//如果请求失败则输出错误连接，并且将http响应的错误代码写入status中  例如：404
function scanUrl(url,par) {
  // /console.log("执行scanUrl()方法:",url);
  // console.log(par);
  $.ajax({
    url: url,
    dataType: 'text',
    success: function(html, _, xhr) {
      getLinkToDb();
      getDetailInfo(html,url,par,xhr.status);
      // console.log("执行scanUrl()方法,开始扫描链接:",url,"已返回成功");
    },
    error: function(e) {
      getLinkToDb();
      dao.updateLinkHtml(url,e.responseText,e.status||999,{});
      console.log(e,"ERRORRRRRRRRRRRRRRRRRRRRRRRR");
      // console.log("执行scanUrl()方法,开始扫描链接:",url,"已返回失败",e.status||999);
    },
    timeout: 30000
  });
}

//获取提取页面细节
function getDetailInfo(html,url,par,status) {
  dao.getPage({url:par},function(page){
    var doc =$(html);
    //页面配置信息的默认值
    var result_obj = {
      content:BG.cleanContent(doc.find('body')),
      keyword:page.keyword_mode,
      time:Date.now
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
        // if(result_obj[name]!=""){
        //   console.log(name,":",result_obj[name]);
        //   result_obj[name] = BG.cleanContent(result_obj[name]);
        // }else{
        //   console.log(name,":",result_obj[name]);
        //   delete(result_obj[name]);
        // }
        
      }
    }
    dao.updateLinkHtml(url, html, status,result_obj, function(){});
    // console.log("执行updateLinkHtml方法，扫描内容已入库：",url);
    // if(JSON.stringify(result_obj)=='{}') console.log("\n=!==",url,page,result_obj);
  });
  
}

var pool = [];
function getLinkToDb(){
  // console.log("初始扫描过程，成功");
  if(pool.length > 0){
   var random = parseInt(Math.random()*pool.length);
   var scanValue = pool.splice(random,1)[0]; //将移除结果数组中的元素返回
   scanUrl(scanValue.url,scanValue.parent);
  }
  else{
    setTimeout(getLinkToDb,1000);
  }
}

//得到Links表中未扫描的url
function getScanLinks() {
  // console.log("初始化准备扫描链接池，成功");
  if(pool.length<MAX_CONNECT_COUNT*2) {
    dao.getLinks(function(rows){
      if(rows.length > 0){
        pool = pool.concat(rows);
      }
      setTimeout(getScanLinks,3000);
    });
  }else {
    setTimeout(getScanLinks,3000);
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
