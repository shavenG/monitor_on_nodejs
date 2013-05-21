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

exports.getInfoListWithPage = function(req, res) {
    // if(req.query.f == "json"){

    // }
    var data = {};
    dao.getTotalCount(function(row) {
        var total = row.total_count;
        // console.log("total/PAGE_PER_COUNT:",total/PAGE_PER_COUNT);
        // console.log("\r\nMath.ceil(total/PAGE_PER_COUNT):",Math.ceil(total/PAGE_PER_COUNT));
        var page_count = Math.ceil(total / PAGE_PER_COUNT);
        data["page_count"] = page_count;
        dao.getLinksWithPage(parseInt(req.query.page),function(rows) {
            var res_list = [];
            for(var i = 0; i < rows.length; i++) {
                var result = {};
                var author = {};
                result["title"] = rows[i]["title"] || "";
                result["description"] = $("<span>"+rows[i]["content"]+"</span>").text().substring(0,30) || "";
                result["content"] = rows[i]["content"] || "";
                result["link"] = rows[i]["link"] || "";
                result["image"] = rows[i]["image"] || "";
                author["name"] = rows[i]["author"] || "";
                author["email"] = rows[i]["author_email"] || "";
                result["author"] = author;
                result["keyword"] = rows[i]["keyword"] || "政策研究,农业部";
                result["time"] = rows[i]["time"];
                result['id'] = rows[i]["id"];
                res_list.push(result);
            }
            data["items"] = res_list;
            res.send(data);
        });
    });
};

exports.getNewById = function(req, res) {
    var id = req.query.id;
    dao.getNewById(id, function(row) {
        var result = {};
        var author = {};
        result["title"] = row["title"] || "";
        result["description"] = $("<span>"+row["content"]+"</span>").text().substring(0,60) || "";
        result["content"] = row["content"] || "";
        result["link"] = row["link"] || "";
        result["image"] = row["image"] || "";
        author["name"] = row["author"] || "";
        author["email"] = row["author_email"] || "";
        result["author"] = author;
        result["keyword"] = row["keyword"] || "政策研究,农业部";
        result["time"] = row["time"];
        result['id'] = row["id"];
        res.send(result);
    })
};