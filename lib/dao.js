module.exports = {
    setBG : function(pa){
        BG = pa;
    },
    getAllPages: function(callback) {
        db.all("SELECT * FROM pages", function(err, rows) {
            return callback(rows);
        });
    },
    getPage: function(data, callback) {
        db.get("SELECT * FROM pages WHERE url = ?", data.url, function(err, row) {
            if(row) if(!row.check_interval) row.check_interval = SETTINGS.DEFAULT_CHECK_INTERVAL;
            return callback(row);
        });
    },
    getAllPageURLs: function(callback) {
        db.all("SELECT url FROM pages", function(err, rows) {
            var urls = [];
            for (var i = 0; i < rows.length; i++) {
              urls.push(rows[i].url);
            }
            return callback(urls);
        });
    },
    getAllUpdatedPages: function(callback) {
        db.all("SELECT * FROM pages WHERE updated = 1", function(err, rows) {
            return callback(rows);
        });
    },
    setPageSettings : function(url, settings, callback) {
        var buffer = [];
        var args = [];
        for(var name in settings) {
            buffer.push(name + ' = ?');
            if(typeof(settings[name]) == 'boolean') {
                settings[name]=settings[name]?1:0;
            }
            args.push(settings[name]);
        }
        args.push(url);

        if(buffer) {
            var query = 'UPDATE pages SET ' + buffer.join(', ') + ' WHERE url = ?';
            db.run(query,args,callback);
        } else {
            (callback || $.noop)();
        }
    },
    addPage: function(page, callback) {
        // if(window != BG) return BG.addPage(page, callback);
        var query = "INSERT INTO pages(url, name, mode, regex, selector, \
                                         check_interval, html, crc, updated, \
                                         last_check, last_changed) \
                       VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.run(query, [
        page.url, page.name || chrome_i18n_getMessage('untitled', page.url), page.mode || 'text', page.regex || null, page.selector || null, page.check_interval || null, page.html || '', page.crc || 0, page.updated ? 1 : 0, Date.now(), page.last_changed || null], null, function() {
            BG.takeSnapshot();
            BG.scheduleCheck();
            (callback || $.noop)();
        });
    },
    addLink: function(link,callback) {
        // console.log("执行addLink()方法");
        var query = "INSERT INTO links(link) VALUES(?)";
        db.run(query,[link],(callback||$.noop)());
    },
    //获取Links表中的所有html字段为空的link
    //即未读取过的页面
    getLinks: function(callback) {
        db.all("SELECT link FROM links WHERE html IS NULL", function(err, rows) {
            var links = [];
            for (var i = 0; i < rows.length; i++) {
              links.push(rows[i].link);
            }
            return callback(links);
        });
    },
    deleteLink: function(link, callback){
        var query = "DELETE FROM links WHERE link=?";
        db.run(query,[link],(callback||$.noop)());
    },
    //更新Links表中的html
    //links表中的html字段为url为link的页面的html
    updateLinkHtml: function(link, html, callback){
        var query = "UPDATE links SET html=? WHERE link=?";
        db.run(query,[html,link],(callback||$.noop)());
    }
};