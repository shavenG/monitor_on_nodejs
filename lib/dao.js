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
            if(row) if(!row.check_interval) row.check_interval = DEFAULT_CHECK_INTERVAL;
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
    //��pages���е����ݽ�����ӻ����޸�
    //��url���ڵļ�¼
    setPageSettings : function(url, settings, callback) {
        var buffer = ['url'];
        db.get("SELECT * FROM pages WHERE url = ?",[url],function(err,rows){
            var result = {};
            if(rows) {
                result = rows;
            }
            for(var name in settings)
                result[name] = settings[name];
            var wenhaos= ['?'];
            var args = [url];
            for(var name in result) {
                buffer.push(name);
                wenhaos.push('?');
                if(typeof(result[name]) == 'boolean') {
                    result[name]=result[name]?1:0;
                }
                args.push(result[name]);
            }
            if(buffer) {
                var query = "insert or replace into pages (" +buffer.join(', ') + ") values (" +wenhaos.join(', ')+")";
                db.run(query,args,callback);
            } else {
                (callback || $.noop)();
            }
        });
    },
    addPage: function(page, callback) {
        var query = "INSERT INTO pages(url, name, mode, regex, selector, \
                                         check_interval, html, crc, updated, \
                                         last_check, last_changed, title_mode, \
                                         title_regex, title_selector, author_mode, author_regex, \
                                         author_selector, content_mode, content_regex,content_selector, \
                                         time_mode, time_regex, time_selector, keyword_mode, keyword_regex, \
                                         keyword_selector) \
                       VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.run(query, [
        page.url, page.name || chrome_i18n_getMessage('untitled', page.url), page.mode || 'text', page.regex || null, page.selector || null, page.check_interval || null, page.html || '', page.crc || 0, page.updated ? 1 : 0, Date.now(), page.last_changed || null, page.title_mode, page.title_regex, page.title_selector, page.author_mode, page.author_regex, page.author_selector, page.content_mode, page.content_regex, page.content_selector, page.time_mode, page.time_regex, page.time_selector, page.keyword_mode, page.keyword_regex, page.keyword_selector], null, function() {
            BG.takeSnapshot();
            BG.scheduleCheck();
            (callback || $.noop)();
        });
    },
    //��link���������ȡ����link��¼
    //�����link�Ѿ������ڱ��У��򸲸Ǹü�¼
    addLink: function(linkObjArr,parent,callback) {
        var linkstr = "(";
        
        for(var i = 0;i<linkObjArr.length; i++) {
            for(var o in linkObjArr[i]) {
                linkstr += "'"+linkObjArr[i].link +"',";
            }
        }
        linkstr = linkstr.substring(0,linkstr.length-1)+")";
 
        if(linkObjArr.length<1) {
            linkstr = "()";
        }

        db.all("select link from links where link in "+linkstr, function(err, rows) {
            // console.log("linkstr:",linkstr,"\r\n","rows:",rows);
            var rowlink = [];
            for(var l=0;l<rows.length;l++) {
                rowlink.push(rows[l].link);
            }
            for(var i = 0;i<linkObjArr.length; i++) {
                if(rowlink.indexOf(linkObjArr[i].link)>-1) {
                    linkObjArr.splice(i,1);
                    i--;
                }
            }
            // console.log(linkObjArr);
            var key = ["parentlink"];
            var wenhao = ["?"];
            var value = [parent];
            for(var j = 0;j<linkObjArr.length;j++){
                for (var o in linkObjArr[j]) {
                    key.push(o);
                    wenhao.push("?");
                    value.push(linkObjArr[j][o]);
                }

                var query = "insert into links (" + key.join(",") + ") values (" + wenhao.join(",") + ")";
                // console.log(query,value);
                db.run(query,value);
                key = ["parentlink"];
                wenhao = ["?"];
                value = [parent];
            }
        });
    },

    //��link���л�ȡδɨ����ģ�����û�г���׼��ɨ��״̬�����ӣ�ÿ��ȡ��1000��
    //statusΪlink��ɨ��״̬������Ϊhttp�������Ӧ���룬��http����Ӧʱ�򣬷���999
    //��status���ֶ�ΪPEDDING��ʱ�򣬸�����¼Ϊ׼��ɨ��״̬
    getLinks: function(callback) {
        db.all("SELECT link,parentlink FROM links WHERE status IS NULL LIMIT 1000", function(err, rows) {
            var links = [];
            var link_single = [];
            if(rows.length>0){
                for (var i = 0; i < rows.length; i++) {
                    var alink = {};
                    alink["url"] = rows[i].link;
                    alink["parent"] = rows[i].parentlink;
                    link_single.push(rows[i].link);
                    links.push(alink);
                }
                var condition = "(";
                for(var j = 0; j < links.length; j++) {
                    condition += "?,"
                }
                condition = condition.substring(0,condition.length-1)+")";
        // console.log("UPDATE links SET status='PEDDING' WHERE link in "+condition,link_single)
                db.run("UPDATE links SET status='PEDDING' WHERE link in "+condition,[link_single]);
            }
            return callback(links);
        });
    },
    getOneLink: function(link,func) {
        var query = "SELECT * FROM links WHERE link=?";
        db.get(query,link,function(err, row){
            return func(row);
        });
    },
    //�Ƴ�ҳ��
    removePage: function(link, callback){
        var query = "DELETE FROM pages WHERE url=?";
        db.run(query,[link],(callback||$.noop)());
    },
    deleteLink: function(link, callback){
        var query = "DELETE FROM links WHERE link=?";
        db.run(query,[link],(callback||$.noop)());
    },
    updateLinkHtml: function(link, html, status, obj, callback){
        var condition = "status=?, html=? ,";
        var value = [status||9999,html];
        for(var o in obj) {
            if(obj[o]!=null){
                condition += o+"=?, ";
                value.push(obj[o]);
            }
        }
        condition = condition.substring(0,condition.length-2);
        value.push(link);
        // console.log(condition,value);
        var query = "UPDATE links SET " + condition + " WHERE link=?";
        // console.log(query);
        db.run(query,value,(callback||$.noop)());
    }
};