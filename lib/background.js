var Worker = require("worker").Worker;
var feedparser = require("feedparser");

//===========================================================BASE.JS=============================
var SETTINGS = {
    check_interval: "WATCHDOG_INTERVAL",//DEFAULT_CHECK_INTERVAL",
    badge_color: "badge_color",
    version: "version",
    sound_alert: "sound_alert",
    notifications_enabled: "notifications_enabled",
    notifications_timeout: "notifications_timeout",
    animations_disabled: "animations_disabled",
    sort_by: "sort_by",
    custom_sounds: "custom_sounds",
    view_all_action: "view_all_action"
},
    REGEX_TIMEOUT = 7E3,
    REGEX_WORKER_PATH = "/lib/regex.js",
    REQUEST_TIMEOUT = 1E4,
    MIN_BODY_TAIL_LENGTH = 100,
    DATABASE_STRUCTURE = "CREATE TABLE IF NOT EXISTS pages (   `url` TEXT NOT NULL UNIQUE,   `name` TEXT NOT NULL,   `mode` TEXT NOT NULL DEFAULT 'text',   `regex` TEXT,   `selector` TEXT,   `check_interval` INTEGER,   `html` TEXT NOT NULL DEFAULT '',   `crc` INTEGER NOT NULL DEFAULT 0,   `updated` INTEGER,   `last_check` INTEGER,   `last_changed` INTEGER );";
(function() {
    var a = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918E3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117];
    crc = function(b) {
        if("string" != typeof b) return null;
        for(var b = encodeUTF8(b), d = b.length, c = 4294967295, f = 0; f < d; f++) c = c >>> 8 ^ a[c & 255 ^ b.charCodeAt(f)];
        return c ^ -1
    }
})();

function encodeUTF8(a) {
    for(var b = [], d = 0; d < a.length; d++) {
        var c = a.charCodeAt(d);
        128 > c ? b.push(String.fromCharCode(c)) : (127 < c && 2048 > c ? b.push(String.fromCharCode(c >> 6 | 192)) : (b.push(String.fromCharCode(c >> 12 | 224)), b.push(String.fromCharCode(c >> 6 & 63 | 128))), b.push(String.fromCharCode(c & 63 | 128)))
    }
    return b.join("")
}

function describeTime(a) {
    var a = Math.floor(a / 1E3),
        b = Math.floor(a / 60) % 60,
        d = Math.floor(a / 3600) % 24,
        c = Math.floor(a / 86400),
        f = "";
    if(c) var e = chrome_i18n_getMessage("day"),
        g = chrome_i18n_getMessage("days", c.toString()),
        f = f + (1 == c ? e : g);
    d && (e = chrome_i18n_getMessage("hour"), g = chrome_i18n_getMessage("hours", d.toString()), f += " " + (1 == d ? e : g));
    !c && b && (e = chrome_i18n_getMessage("minute"), g = chrome_i18n_getMessage("minutes", b.toString()), f += " " + (1 == b ? e : g));
    f || (e = chrome_i18n_getMessage("second"), g = chrome_i18n_getMessage("seconds", a.toString()), f += " " + (1 == a ? e : g));
    return f.replace(/^\s+|\s+$/g, "")
}
function describeTimeSince(a) {
    return chrome_i18n_getMessage("ago", describeTime(Date.now() - a))
}
// Takes a string representation of an HTML document, discards everything
// outside the <body> element (if one exists), then strips <script> tags.

function getStrippedBody(html) {
  var body = html.match(/<body[^>]*>(?:([^]*)<\/body>([^]*)|([^]*))/i);
  if(body && body.length > 1) {
    if(body[2] && body[2].length > MIN_BODY_TAIL_LENGTH) {
      body = body[1] + ' ' + body[2];
    } else if(body[1] === undefined) {
      body = body[3];
    } else { 
      body = body[1];
    }
  } else {
    body = html;
  }

  return body.replace(/<script\b[^>]*(?:>[^]*?<\/script>|\/>)/ig, '');
}

function getFavicon(a) {
    // return "chrome://favicon/" + a
    return "#"
}

function applyLocalization() {
    $(".i18n[title]").each(function() {
        $(this).removeClass("i18n").text(chrome_i18n_getMessage($(this).attr("title"))).attr("title", "")
    })
}
function getSetting(a) {
    return eval(SETTINGS[a]);
    // return JSON.parse(localStorage.getItem(a) || "null")
}
function setSetting(a, b) {
    localStorage.setItem(a, JSON.stringify(b))
}
function delSetting(a) {
    localStorage.removeItem(a)
}
function initializeStorage(a) {
    executeSql(DATABASE_STRUCTURE, $.noop, a)
}

// Executes the specified SQL query with the specified arguments within a
// transaction. If resultCallback is specified, it is called with the result of
// the query. If transactionCallback is specified, it is called after the
// transaction is successful (if it is).
function executeSql(sql, args, resultCallback, transactionCallback) {
  DB.transaction(function(transaction) {
    transaction.executeSql(sql, args, function(_, result) {
      (resultCallback || $.noop)(result);
    });
  }, $.noop, (transactionCallback || $.noop));
}

function sqlResultToArray(a) {
    for(var b = [], d = 0; d < a.rows.length; d++) b.push(a.rows.item(d));
    return b
}
/*******************************************************************************
 *                              Cleaning & Hashing                              *
 *******************************************************************************/

// Takes a page (HTML or text) and a MIME type (allowing a ;q=... suffix) and
// converts the page to its canonical form. For HTML and XML, this means
// collapsing spaces. For other types, no transformation is applied. Empty input
// results in empty output.

function canonizePage(page, type) {
  if(!page) return page;
  return type.match(/\b(x|xht|ht)ml\b/) ? page.replace(/\s+/g, ' ') : page;
}

// Searches for all matches of regex in text, formats them into a single string,
// then calls the callback with the result as an argument. If matching the regex
// takes more than REGEX_TIMEOUT, the matching is cancelled and the callback is
// called with a null argument.

function findAndFormatRegexMatches(text, regex, callback) {
  if(!callback) return;
  if(!regex) return callback('');
    text = text.replace(/\r/g,'').replace(/\n/g,'');
    var reg = new RegExp(regex, 'gi');
    var match = null;
    var results = [];
    while (match = reg.exec(text, reg.lastIndex)) {
      if (match.join('').length == 0) break;
      if (match.length == 1) {
        // If there were no captured groups, append the whole match.
        results.push('"' + match[0] + '"');
      } else {
        // Otherwise append all capture groups but not the whole match.
        results.push('"' + match.slice(1).join('", "') + '"');
      }
    }

    var result_str = results.join('\n');
    callback(result_str);
    return result_str;
}



// Searches for all matches of selector in the body of the html string, formats
// them into a single string, then calls the callback with the result as an
// argument. If called with an invalid selector, the callback is called with a
// null.

function findAndFormatSelectorMatches(html, selector, callback) {
  try {
    var body = $('<body>').html(getStrippedBody(html));
    var result = $(selector, body).map(function() {
      return '"' + $('<div>').append(this).html() + '"';
    }).get().join('\n');
    (callback || $.noop)(result);
    return result;
  } catch(e) {
    (callback || $.noop)(null);
  }
}

//正则表达式过滤提取链接
//貌似作废了。。。。现在这放着吧。。。你们看不见啊看不见！！！
function cleanHtmlPageByRegex(html,callback) {
  html = html.toLowerCase();
  html = getStrippedBody(html);
  var match = /<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g;
  var regex = new RegExp(match);
  var res = "{";
  while(regex.exec(html)!=null){
    res += "\""+RegExp.$1 + "\":\"" +RegExp.$2+"\",";
  }
  res = res.substring(0,res.length-1);
  
  html = res + "}";
  if(callback) {
    callback(html);
  } else {
    return html;
  }
}

// Extract the text out of the HTML page, then calls the callback with the
// result as an argument. If no callback is provided, simply returns the result.
// The extraction includes:
// 1. Trimming everything outside of <body> through getStrippedBody().
// 2. Removing the contents of script, style, object, embed and applet tags.
// 3. Replacing images with their src, surrounded by "startimg" and "endimg".
// 4. Removing all tags.
// 5. Removing time, date and cardinality number suffixes (1st, 5pm, 3 weeks).
// 6. Removing all ASCII non-letter characters.
// 7. Casting all the result into lowercase.

function cleanHtmlPage(html, callback) {
  html = html.toLowerCase();
  // Get rid of everything outside the body.
  html = getStrippedBody(html);
  // Remove major non-text elements.
  html = html.replace(/<(script|style|object|embed|applet)[^>]*>[^]*?<\/\1>/g, '');
  // Replace images with their sources (to preserve after tag stripping).
  html = html.replace(/<img[^>]*src\s*=\s*['"]?([^<>"' ]+)['"]?[^>]*>/g, '{startimg:$1:endimg}');
  // Strip tags.
  html = html.replace(/<[^>]*>/g, '');
  // Collapse whitespace.
  html = html.replace(/\s+/g, ' ');
  // Unescape HTML entities (&nbsp;, &amp;, numeric unicode entities, etc.).
  html = $('<div/>').html(html).text();
  // Remove numbers with common number suffixes. This helps with pages that
  // print out the current date/time or time since an item was posted.
  html = html.replace(/\d+ ?(st|nd|rd|th|am|pm|seconds?|minutes?|hours?|days?|weeks?|months?)\b/g, '');
  // Remove everything other than letters (unicode letters are preserved).
  html = html.replace(/[\x00-@[-`{-\xBF]/g, '');

  if(callback) {
    callback(html);
  } else {
    return html;
  }
}

// Calculates the CRC of a page, after cleaning it, and calls the callback with
// this CRC as an argument. If mode=regex and the regex parameter is set, the
// page is cleaned by replacing it with all the matches of this regex. If
// mode=selector and the selector parameter is set, the pages is cleaned by
// replacing it with the outerHTML of all matches of that selector. Otherwise
// cleaning means calling cleanHtmlPage() which pretty much extracts the text
// out of the HTML (see the function for more details).

function cleanPage(html, mode, regex, selector, callback) {
  if(!callback) return;
    function callBackWithCrc(result) {
      callback(result || '');
    }
    var res_html;
    if(mode == 'regex' && regex) {
      res_html = findAndFormatRegexMatches(html, regex, function(){});
    } else if(mode == 'selector' && selector) {
      res_html = findAndFormatSelectorMatches(html, selector, $.noop());
    } else {
      res_html = html;
    }
    callBackWithCrc(res_html);
    return res_html;
}

function cleanAndHashPage(html, mode, regex, selector, callback) {
    return cleanPage(html, mode, regex, selector, function(e){
      callback(crc(e))
    });
}

/*******************************************************************************
 *                                Page Checking                                 *
 *******************************************************************************/

// Performs a check on the specified page, and updates its crc field with new
// info. If a change is detected, sets the updated flag on that page. Once the
// check is done and all updates are applied, the callback is called with the
// URL of the checked page.
// 
// If the changes in the page did not result in a different CRC from the one
// recorded (e.g. changes in numbers only, or in non-selected parts during
// selective monitoring), or force_snapshot is checked, the html field of the
// page is updated. It is not updated when the CRC changes so that the diff
// viewer has a snapshot of the page before the latest update.

function checkPage(url, callback, force_snapshot) {
  dao.getPage({url:url}, function(page) {
    if(!page || page.updated) {
      (callback || $.noop)(url);
      return;
    }
    $.ajax({
      url: url,
      dataType: 'text',
      success: function(html, _, xhr) {
        // console.log("Get Page Success:",url);
        var y_html; 
        var n_html = html; 

        var crc;
        var type = xhr.getResponseHeader('Content-type');
        dao.getPage({url:url}, function(page) {
          var html_s = cleanAndHashPage(html, page.mode, page.regex, page.selector,function(e){
            crc= e;
          });
            var settings = {};
            // console.log("crc:",crc);
            if(crc != page.crc) {
              y_html = page.html;
              settings = {
                updated: true,
                crc: crc,
                html: force_snapshot ? canonizePage(html, type) : page.html,
                last_changed: Date.now()
              };
              var c_html = "";
              var garr = getLinksInHtml(html_s,url,function(garr) {
                dao.addLink(garr,url);
              });
              // var glinks = [];
              // for(var gar in garr) {
              //   glinks.push(garr[gar].url);
              // }
              
            } else {
              settings = {
                html: canonizePage(html, type)
              };
            }
            settings.last_check = Date.now();
            //标记为已读
            settings.updated = 0;
            dao.setPageSettings(url, settings, function() {
              (callback || $.noop)(url);
            });
        });
      },
      error: function(e) {
        console.log("error info:",e.error());
        dao.setPageSettings(url, {
          last_check: Date.now()
        }, function() {
          (callback || $.noop)(url);
        });
      },
      complete: function(e) {
        // console.log(e,"COMPLETEEEEEEEEEEEEEEEEEEEEEEE");
      },
      timeout: 30000
    });
  });
}

//将指定html的标签属性过滤掉
function cleanContent(html) {
  if(html==null){
    html = "";
  }
  return html.toString().replace(/\r/g,'').replace(/\n/g,'').replace(/<([a-z][a-z0-9]*)(?:[^>]*(\ssrc=['\"][^'\"]*['\"]))?[^>]*?(\/?)>/gi,'<$1$2$3>');
}

//提取网页中链接及指定信息
function getLinksInHtml(html,url,callback) {
  //解析出域名
  var url_module = require("url");
  var url_ad = url_module.parse(url);
  var host = url_ad.protocol + "//" + url_ad.host;

  var links_arr = [];
  if(html != null && html != ""){
    var link_html = $(html).find("item").html();
    // console.log("html:",link_html);
    if(link_html != null && link_html != ""){
      console.log("Rss源");
      feedparser.parseString(html).on('article', function(article,e,f){
          links_arr.push({"link" : article.link,"title" : article.title||"未获取到标题","time":Date.now(),"author":host});
      }).on('end',function(){callback(links_arr);});
    }else{
      // var match = /<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g;
      var match = $(html).find("a");
      // var regex = new RegExp(match);
      for(var i = 0;i<match.length;i++){
        var link_rec = $(match[i]).attr("href");
        
        //无脑的url拼凑过程
        if(link_rec.toLowerCase().substring(0,7)!="http://"
           && link_rec.toLowerCase().substring(0,8)!="https://"
           && link_rec.toLowerCase().substring(0,6)!="ftp://"){
          
          if(link_rec.substring(0,1)=="/"){
            links_arr.push({"link" : (host + link_rec)});
          }else{
            links_arr.push({"link" : url.replace(/\/[^\/]*?$/g,"") + "/" + link_rec});
          }
        } else {
          links_arr.push({"link":link_rec});
        }

        links_arr[links_arr.length-1]["title"] = $(match[i]).attr("title")||$(match[i]).text();
        links_arr[links_arr.length-1]["time"] = Date.now();
        links_arr[links_arr.length-1]["author"] = host;
      }
      callback(links_arr);
    }
  }
  else
    callback([]);
}

//将指定的url的updated字段改为已读
function takeSnapshot(url, callback) {
  checkPage(url, function() {
    console.log ("执行takeSnapshot()方法");
    dao.setPageSettings(url, { updated: 0 }, callback);
  }, true);
}
// $.ajaxSetup({
//     timeout: REQUEST_TIMEOUT,
//     cache: !1
// });

//===========================================================END BASE.JS=========================

/*******************************************************************************
*                             Update Notifications                             *
*******************************************************************************/

(function() {
  // The number of updated pages that has been last shown on the badge.
  var last_count = 0;
  // The last shown notification. Saved so it can be hidden later.
  var notification = null;

  // Triggers a sound alert if it is enabled.
  triggerSoundAlert = function() {
    // var sound_alert = getSetting(SETTINGS.sound_alert);
    // if (sound_alert) {
    //   new Audio(sound_alert).addEventListener('canplaythrough', function() {
    //     this.play();
    //   });
    // }
  };

  // Triggers a desktop notification if they are enabled, notifing the user of
  // updates to the pages specified in the argument.
  triggerDesktopNotification = function() {
    if (!getSetting(SETTINGS.notifications_enabled)) return;
    if (chrome.extension.getViews({ type: 'popup' }).length > 0) return;
    var timeout = getSetting(SETTINGS.notifications_timeout) || 30000;

    var url = 'notification.htm';
    notification = webkitNotifications.createHTMLNotification(url);

    notification.show();
    if (timeout <= 60000) setTimeout(hideDesktopNotification, timeout);
  };

  // Hides the currently shown desktop notification (if one is displayed).
  hideDesktopNotification = function() {
    if (notification) {
      notification.cancel();
      notification = null;
    }
  };

  // Checks if any pages are marked as updated, and if so, displays their count
  // on the browser action badge. If no pages are updated and the badge is
  // displayed, removes it. This also triggers sound alerts and/or desktop
  // notifications if applicable.
  updateBadge = function() {
    dao.getAllPages(function(updated_pages) {
    //dao.getAllUpdatedPages(function(updated_pages) {
      var count = updated_pages.length;
      // chrome.browserAction.setBadgeBackgroundColor({
      //   color: getSetting(SETTINGS.badge_color) || [0, 180, 0, 255]
      // });
      // chrome.browserAction.setBadgeText({ text: count ? String(count) : '' });
      // chrome.browserAction.setIcon({ path: BROWSER_ICON });
      if (count > last_count) {
        // triggerSoundAlert();
        // triggerDesktopNotification();
      }
      last_count = count;
    });
  };
})();

(function() {
  // The ID of the timeout that initiates the next check.
  var check_timeout_id = 0;

  // The time when the next check should be performed. Use by the watchdog to
  // make sure no check is missed.
  var projected_check_time = 0;

  //标记检测到的页面为已读状态
  //自己写的
  markPageVisited = function (url) {
    // console.log("执行markPageVisited()方法:url=",url);
    var url = url;
    var that = this;
    // $.get("/services/setPageSettings",{url:url,settings:{ updated: 0 }},function() {
      // BG.updateBadge();
    takeSnapshot(url, function(){});
    // });
  };

  // Performs the page checks. Called by check() to do the actual work.
  actualCheck = function(force, callback, page_callback) {
    dao.getAllPages(function(pages) {
      var current_time = Date.now();
      var pages_to_check = force ? pages : $.grep(pages, function(page) {
        var interval = page.check_interval ||
                       WATCHDOG_INTERVAL;
        var projected_check = page.last_check + interval - EPSILON;
        return projected_check <= current_time;
      });
      var pages_checked = 0;

      function notifyAllChecksFinished() {
        updateBadge();
        scheduleCheck();
        (callback || $.noop)();
      }

      function notifyCheckFinished(url) {
        (page_callback || $.noop)(url);
        pages_checked++;
        console.assert(pages_checked <= pages_to_check.length);
        if (pages_checked == pages_to_check.length) {
          notifyAllChecksFinished();
        }
      }

      if (pages_to_check.length) {
        $.each(pages_to_check, function(i, page) {
          checkPage(page.url, notifyCheckFinished);
          // checkPage(page.url, notifyCheckFinished ,!0);
        });
      } else {
        notifyAllChecksFinished();
      }
    });
  };

  // Sets the next check to go off after the number of milliseconds specified.
  // Updates projected_check_time for the watchdog.
  applySchedule = function(after) {
    console.log(after,"毫秒后执行")
    projected_check_time = Date.now() + after;
    clearTimeout(check_timeout_id);
    check_timeout_id = setTimeout(check, after);
  };

  // Calculates the minimum amount of time after which at least one page needs a
  // check, then calls applySchedule() to schedule a check after this amount of
  // time.
  scheduleCheck = function() {
    var current_time = Date.now();

    dao.getAllPages(function(pages) {
      if (pages.length == 0) return;
      var times = $.map(pages, function(page) {
        if (page.updated || !page.last_check) {
          return current_time;
        } else {
          var check_interval = page.check_interval ||
                               WATCHDOG_INTERVAL;
          console.log(page.last_check + check_interval - current_time);
          return page.last_check + check_interval - current_time;
        }
      });

      var min_time = Math.min.apply(Math, times);

      if (min_time < MINIMUM_CHECK_SPACING) {
        min_time = MINIMUM_CHECK_SPACING;
      } else if (min_time == current_time) {
        // No pages need to be checked.
        min_time = DEFAULT_CHECK_INTERVAL;
      }
      applySchedule(min_time);
    });
  };

  // Checks each page that has reached its projected check time, calling
  // page_callback() for each page once it's checked, then update the badge,
  // call scheduleCheck(), and finally call callback(). If force is true, all
  // pages are checked regardless of whether their projected check time has been
  // reached. If the network connection is down, reschedule a check after
  // RESCHEDULE_DELAY.
  check = function(force, callback, page_callback) {
    $.ajax({
      type: 'HEAD',
      url: RELIABLE_CHECKPOINT,
      complete: function(xhr) {
        if (xhr && xhr.status >= 200 && xhr.status < 300) {
          // Network up; do the check.
          actualCheck(force, callback, page_callback);
        } else {
          // Network down. Do a constant reschedule.
          applySchedule(RESCHEDULE_DELAY);
          (callback || null)();
        }
      }
    });
  };

  // Makes sure that we haven't lost the check timeout. If we have, restarts it.
  // If everything goes well, this should never be needed, but better be safe
  // than sorry.
  // 如果没有超出2分钟未作任何动作，则不执行
  watchdog = function() {
    if (Date.now() - projected_check_time > WATCHDOG_TOLERANCE) {
      // console.log('WARNING: Watchdog recovered a lost timeout.');
      scheduleCheck();
    }
  };
})();
(function() {
    var a = null;
    getExtensionVersion = function() {
        if(!a) {
            var b = $.ajax({
                url: "manifest.json",
                async: !1
            }).responseText;
            if(b = JSON.parse(b || "null")) a = b.version
        }
        return a
    }
})();

module.exports = {
  "watchdog": function(){
      watchdog();
      setInterval(watchdog,WATCHDOG_INTERVAL);
  },
  "takeSnapshot":takeSnapshot,
  "scheduleCheck":scheduleCheck,
  "findAndFormatRegexMatches":findAndFormatRegexMatches,
  "findAndFormatSelectorMatches":findAndFormatSelectorMatches,
  "cleanAndHashPage":cleanAndHashPage,
  "getLinksInHtml": getLinksInHtml,
  "cleanPage": cleanPage,
  "cleanContent": cleanContent,
  "scheduleCheck": scheduleCheck
};


//============================================DAO=======================================
