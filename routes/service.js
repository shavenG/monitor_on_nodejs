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
        res.send("success");
    });
}

exports.getPageContent = function(req, res) {
    var url = req.query.url;
    var mode = req.query.mode;
    var mode_string = req.query.mode_string;
    $.get(url, function(html) {
        var findAndFormat = (mode == 'regex') ? BG.findAndFormatRegexMatches : BG.findAndFormatSelectorMatches;
        findAndFormat(html, mode_string, function(results) {
           var decodeIconv = new Iconv('GBK', 'UTF-8//TRANSLIT//IGNORE');
            var buffer = decodeIconv.convert(results).toString();

            console.log(buffer);
            res.send(buffer);
        });
    });
}