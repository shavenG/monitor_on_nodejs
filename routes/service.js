var Iconv = require("iconv").Iconv;

exports.getAllPages = function(req, res) {
    dao.getAllPages(function(rows) {
        res.send(rows);
    });
};

exports.getPage = function(req, res) {
    dao.getPage(req.query, function(row) {
        res.send(row);
    });
};

exports.getAllPageURLs = function(req, res) {
    dao.getAllPageURLs(function(rows) {
        res.send(rows);
    });
};

exports.getAllUpdatedPages = function(req, res) {
    dao.getAllUpdatedPages(function(rows) {
        res.send(rows);
    });
};

exports.setPageSettings = function(req, res) {
    dao.setPageSettings(req.query.url, req.query.settings, function() {
        BG.scheduleCheck();
        res.send("success");
    });
}

exports.addPage = function(req, res) {
    dao.addPage(req.query.page, function() {
        res.send("success");
    });
};

exports.removePage = function(req, res) {
    dao.removePage(req.query.url, function() {
        res.send("success");
    });
};

exports.getPageContent = function(req, res, sub) {
    var url = req.query.url;
    var mode = req.query.mode;
    var mode_string = req.query.mode_string;
    var ex_mode = req.query.ex_mode;
    var ex_string = req.query.ex_string;
    $.get(url, function(html) {
        BG.cleanPage(html, mode, mode_string, mode_string, function(results) {
            if(sub) return res.send(results);
            BG.getLinksInHtml(results,url,function(links) {
                if(req.query.sub){
                    if(links.length>0){
                        req.query = {"url":links[0].link,"mode":ex_mode,"mode_string":ex_string};
                        exports.getPageContent(req,res,true);
                    }else{
                        res.send("无法找到链接");
                    }
                }else{
                    var result = "";
                    for(var link_id in links){
                        result += links[link_id].title + " ： " + links[link_id].link + "\r\n";
                    }
                    res.send(result);
                }
            });
        });
    });
};

exports.getCountResult = function(req, res) {
    var result = {};
    dao.getCurrentDayCount(function(row){
        result["today_count"] = row.today_count;
        dao.getReadedCount(1,function(row){
            result["readed_count"] = row.readed_count;
            dao.getTotalCount(function(row){
                result["total_count"] = row.total_count;
                res.send(result);
            });
        });
    });
};