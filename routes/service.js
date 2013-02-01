exports.getAllPages = function(req, res){
    dao.getAllPages(function(rows) {
        res.send(rows);
    });
};

exports.getPage = function(req, res){
    dao.getPage(req.query,function(row) {
         res.send(row);
    });
};

exports.getAllPageURLs = function(req, res){
    dao.getAllPageURLs(function(rows) {
         res.send(rows);
    });
};

exports.getAllUpdatedPages = function(req, res){
    dao.getAllUpdatedPages(function(rows) {
         res.send(rows);
    });
};

exports.setPageSettings = function(req,res){
    dao.setPageSettings(req.query.url,req.query.settings,function(){
        res.send("");
    });
}