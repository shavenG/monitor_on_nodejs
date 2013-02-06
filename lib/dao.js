module.exports = {
    setBG : function(pa){
        BG = pa;
    },
    getAllPages: function(func) {
        db.all("SELECT * FROM pages", function(err, rows) {
            return func(rows);
        });
    },
    getPage: function(data, func) {
        db.get("SELECT * FROM pages WHERE url = ?", data.url, function(err, row) {
            if(row) if(!row.check_interval) row.check_interval = SETTINGS.DEFAULT_CHECK_INTERVAL;
            return func(row);
        });
    },
    getAllPageURLs: function(func) {
        db.all("SELECT url FROM pages", function(err, rows) {
            var urls = [];
            for (var i = 0; i < rows.length; i++) {
              urls.push(rows[i].url);
            }
            return func(urls);
        });
    },
    getAllUpdatedPages: function(func) {
        db.all("SELECT * FROM pages WHERE updated = 1", function(err, rows) {
            return func(rows);
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
        console.log("执行addLink()方法");
        var query = "INSERT INTO links(link) VALUES(?)";
        db.run(query,[link],(callback||$.noop)());
    }
};