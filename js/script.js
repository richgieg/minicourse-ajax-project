
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // Clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // Load Street View image
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    $greeting.text('So, you want to live at ' + address + '?');
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location='
    streetviewUrl += address;
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // Get NY Times articles
    var ntTimesApiKey = 'e817161e84db6654032367d6982af781:5:74042945';
    var nyTimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?sort=newest&fl=headline,web_url,snippet';
    nyTimesUrl += '&q=' + cityStr + '&api-key=' + ntTimesApiKey;
    $.getJSON(nyTimesUrl, function(data) {
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);
        var articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' +
                '<a href="' + article.web_url + '">' + article.headline.main +
                '</a><p>' + article.snippet + '</p></li>');
        }
    }).error(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    // Get Wikipedia info
    var wikiUrl = 'http://en.wikipeddia.org/w/api.php?action=opensearch' +
        '&format=json&search=' + cityStr;

    // Create error handler for Wikipedia JSONP request
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('Failed to get Wikipedia resources');
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        // jsonp: 'callback',
        success: function(response) {
            var articleList = response[1];
            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' +
                    articleStr + '</a></li>');
            }
            clearTimeout(wikiRequestTimeout);
        }
    });

    // Cancel the submit action
    return false;
};

$('#form-container').submit(loadData);
