/* TODO:
 *
 * Articles - Add current page info
 *
 * Retrieve html without loading resources
 *
 * Remove getVarQueryStringData()
 * Add traditional
 * Compress javascipt
 * 
 */

function getUrlQueryStringData(name) {
    var result = null;
    var regexS = "[\\?&#]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec('?' + window.location.href.split('?')[1]);
    if (results != null) {
        // Regex for replacing addition symbol with a space
        result = decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    return result;
};

function getVarQueryStringData(name, data) {
    var result = null;
    var regexS = "[\\?&#]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec('?' + data.split('?')[1]);
    if (results != null) {
        // Regex for replacing addition symbol with a space
        result = decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    return result;
};

//$(document).bind("mobileinit", function () {});

// Load the data for a specific category, based on
// the URL passed in. Generate markup for the items in the
// category, inject it into an embedded page, and then make
// that page the current active page.

//$( document ).on( 'pageshow', 'div[data-url*="articles.htm?category"]', function(e, data){
$( document ).on( 'pageshow', 'div[id="articles"]', function(e, data){
    var urlQuery = getUrlQueryStringData("url"),
        categoryQuery = getUrlQueryStringData("category"),

        // Get the object that represents the category we
        // are interested in. Note, that at this point we could
        // instead fire off an ajax request to fetch the data, but
        // for the purposes of this sample, it's already in memory.
        categoryURL = "";
        
    if (categoryQuery) {
        categoryURL = 'http://1688.com.au/site1/news/' + categoryQuery + '/index.shtml';
    } else if (urlQuery) {
        categoryURL = urlQuery.replace(/.*site1\/news/, "http://1688.com.au/site1/news");
    }

    $.get(categoryURL, function (categorydata) {
        // Get the page we are going to dump our content into.
        //var $page = $(pageSelector),
        var $page = $('div[id="articles"]'),

            // Get the header for the page.
            $header = $page.children(":jqmData(role=header)"),

            // Get the content area element for the page.
            $content = $page.children(":jqmData(role=content)"),

            // Get the footer for the page.
            $footer = $page.children(":jqmData(role=footer)"),

            // The markup we are going to inject into the content
            // area of the page.
            markup = "<ul data-role='listview' data-theme='c' data-dividertheme='a' data-inset='false'>",
            
            articlelist = "";
            navlist = "",            
            navheader = "";

        $("td[class=list1_1]:first a[href]:last", categorydata.responseText).each(function () {
            var headingdata = $(this),
                headingName = headingdata.text();
            if (headingName) {
                // Find the h1 element in our header and inject the name of
                // the category into it.
                $header.find("h1").html($.trim(headingName));
            }
        });

        $("table[class=list1]:first tbody tr:last a[href]", categorydata.responseText).each(function () {
            var navitemdata = $(this),
                navitemurl = navitemdata.attr('href');
            if (navitemurl) {
                navlist += "<li><a href='articles.htm?url=" + encodeURIComponent(navitemurl) + "'>";
                navlist += navitemdata.text() + "</a></li>";
            }
        });

        $("table[class=list1]:first tbody tr:last td:first div:first", categorydata.responseText).each(function () {
            var navdata = $(this),
                navtext = navdata.text();
            if (navtext) {
                var navtemp = $.trim(navtext.split("【")[1]);
                if (navtemp) {
                    navheader += "<li data-role='list-divider' style='text-align:center' role='heading'>";
                    navheader += navtemp + "</li>";
                }
            }
        });

        // Generate a list item for each item in the category
        // and add it to our markup.
        $("table[width='615']:first tbody tr:has(td[width='70%'])", categorydata.responseText).each(function () {
            var newsitemdata = $(this),
                newsitemurl = $("td[width='70%'] p a", newsitemdata).attr('href');
            if (newsitemurl) {
                if (categoryURL.indexOf(newsitemurl) == -1) {
                    articlelist += "<li>";
                    articlelist += "<a href='view.htm?url=" + encodeURIComponent(newsitemurl) + "'>";
                    articlelist += "<p>" + $("td[width='70%'] p a", newsitemdata).text() + "</p>";
                    articlelist += "<p>" + $("td[width='20%'] p", newsitemdata).text() + "</p>";
                    articlelist += "</a>";
                    articlelist += "</li>";
                }
            }
        });
        markup += navheader;
        markup += articlelist;
        if (articlelist != "") {
            markup += navheader;
        }
        markup += "</ul>";

        if (navlist != "") {
            $footer.html("<div data-role='navbar'><ul>" + navlist + "</ul></div>");
        }

        // Inject the category items markup into the content element.
        $content.html(markup);

        // Pages are lazily enhanced. We call page() on the page
        // element to make sure it is always enhanced before we
        // attempt to enhance the listview markup we just injected.
        // Subsequent calls to page() are ignored since a page/widget
        // can only be enhanced once.
        $page.page();

        // Enhance the navbar we just injected.
        $footer.find(":jqmData(role=navbar)").navbar();

        // Enhance the listview we just injected.
        $content.find(":jqmData(role=listview)").listview();

    });
});

// Load the data for a specific news, based on
// the URL passed in. Generate markup for the items in the
// news, inject it into an embedded page, and then make
// that page the current active page.

//$( document ).on( 'pageshow', 'div[data-url*="view.htm?id"]', function(e, data){
$( document ).on( 'pageshow', 'div[id="view"]', function(e, data){
    var urlQuery = getUrlQueryStringData("url"),

        // Get the object that represents the news we
        // are interested in. Note, that at this point we could
        // instead fire off an ajax request to fetch the data, but
        // for the purposes of this sample, it's already in memory.
        newsURL = ((urlQuery) ? urlQuery.replace(/.*site1\/news/, "http://1688.com.au/site1/news") : "");

    //newsURL = 'http://1688.com.au/site1/news/world/2013/04/30/886965.shtml';
    //newsURL = 'http://1688.com.au/site1/news/world/2013/04/30/886826.shtml';
    //newsURL = 'http://1688.com.au/site1/news/vic/2013/04/19/876125.shtml';    
    //newsURL = 'http://1688.com.au/site1/news/au/2013/05/02/888601.shtml';
    //newsURL = 'http://1688.com.au/site1/news/au/2013/05/11/907753.shtml';
    $.get(newsURL, function (newsdata) {

        // Get the page we are going to dump our content into.
        var $page = $('div[id="view"]'),

            // Get the header for the page.
            $header = $page.children(":jqmData(role=header)"),

            // Get the content area element for the page.
            $content = $page.children(":jqmData(role=content)"),

            // The markup we are going to inject into the content
            // area of the page.
            markup = "<div id='turbocmscontent'>",
            
            list = "";

        $("td[class=content1_3]:first", newsdata.responseText).each(function () {
            var titledata = $(this).text();
            if (titledata) {
                // Find the h1 element in our header and inject the name of
                // the news into it.
                $header.find("h1").html($.trim(titledata));
            }
        });

        $("td[id=content]:first", newsdata.responseText).each(function () {
            var newsitemdata = $(this).html(),
                newscontent = newsitemdata.substring(
                    newsitemdata.indexOf('<!--turbocmscontentbegin-->') + 27,
                    newsitemdata.indexOf('<!--turbocmscontentend-->'));
            markup += newscontent; //modifiednewscontent;
          //console.log(newsitemdata);
          //console.log(newscontent);
        });
        markup += "</div><br><br>";
        // Generate a list item for each item in the news
        // and add it to our markup.
        /*$('td[class=content1_6] ul:first:has(li a[href])', newsdata.responseText).each(function () {
            var relatednewsitemdata = $(this),
                relatednewsitemurl = relatednewsitemdata;
            if (relatednewsitemurl) {
                list += relatednewsitemurl.html();
            }
        });*/
        $('td[class=content1_6] ul li a[href]', newsdata.responseText).each(function () {
            var relatednewsitemdata = $(this),
                relatednewsitemurl = relatednewsitemdata.attr('href');
            if (relatednewsitemurl) {
                if (newsURL.indexOf(relatednewsitemurl) == -1) {
                        list += "<li>";
                        list += "<a href='view.htm?url=" + encodeURIComponent(relatednewsitemurl) + "'>";
                        list += relatednewsitemdata.text();
                        list += "</a>";
                        list += "</li>";
                }
            }
        });
        markup += "<ul data-role='listview' data-theme='c' data-dividertheme='a' data-inset='false'>";
        if (list != "") {
            markup += "<li data-role='list-divider' role='heading'>相关文章</li>";
            markup += list;
        }
        markup += "</ul>";
        // Inject the news items markup into the content element.
        $content.html(markup);
        $('#turbocmscontent img').css({ 'max-width' : '80%', 'height' : 'auto' });
        $('#turbocmscontent img[src]').attr('src', function (index, src) {
            if (src.indexOf('//') == -1) {
                if (src.substring(0, 1) == '/') {
                    return 'http://1688.com.au' + src;                    
                }
                return newsURL.substring(0, newsURL.lastIndexOf('/')+1) + src;
            }
            return src;
        });
        // Add not start with
        /*$('#turbocmscontent a[href]').attr('target', function (index, target) {
            return '_blank';
        });*/
        $('#turbocmscontent a[href]').attr('href', function (index, href) {
            if (href.substring(0, 12) == '/site1/news/' || href.substring(0, 11) == 'site1/news/' ||
              href.indexOf('1688.com.au/site1/news/') != -1) {
                if (newsURL.indexOf(href) == -1) {
                    return "view.htm?url=" + encodeURIComponent(href);
                }
                //return "view.htm?url=" + encodeURIComponent(href);
                return "#";
            }
            if (href.indexOf('//') == -1 && href.substring(0, 1) != '#') {
                if (href.substring(0, 1) == '/') {
                    return 'http://1688.com.au' + href;                    
                }
                return newsURL.substring(0, newsURL.lastIndexOf('/')+1) + href;
            }
            return href;
        });
        $('#turbocmscontent a[href^="view.htm"]').removeAttr('target');
        $('#turbocmscontent link[href]').attr('href', function (index, href) {
            if (href.indexOf('//') == -1) {
                if (href.substring(0, 1) == '/') {
                    return 'http://1688.com.au' + href;                    
                }
                return newsURL.substring(0, newsURL.lastIndexOf('/')+1) + href;
            }
            return href;
        });
        $('#turbocmscontent script[src]').attr('src', function (index, src) {
            if (src.indexOf('//') == -1) {
                if (src.substring(0, 1) == '/') {
                    return 'http://1688.com.au' + src;                    
                }
                return newsURL.substring(0, newsURL.lastIndexOf('/')+1) + src;
            }
            return src;
        });
        // Pages are lazily enhanced. We call page() on the page
        // element to make sure it is always enhanced before we
        // attempt to enhance the listview markup we just injected.
        // Subsequent calls to page() are ignored since a page/widget
        // can only be enhanced once.
        $page.page();
        // Enhance the listview we just injected.
        $content.find(":jqmData(role=listview)").listview();
    });
});
