/*********************************************************************
* #### jQuery File Browser Awesome v0.2.0 ####
* Coded by Ican Bachors 2014.
* https://github.com/bachors/jQuery-File-Browser-Awesome
* https://github.com/bachors/TVTeditor
* https://github.com/bachors/jQuery-Github-Repos-Feed
* Updates will be posted to this site.
*********************************************************************/

var fba = function(g) {
	var fileName = '';
    var k = {
        html: 'text/html',
        css: 'text/css',
        js: 'text/javascript',
        php: 'application/x-httpd-php'
    };
    g.mode = (g.mode == undefined ? k : g.mode);
        var j = '<div class="fba_direktori">' + 
				'<div class="fba_tree"><ul>' +
				'<li class="parent active"><a class="sub" data-red="no" id="fba_github"><i class="fa fa-github"></i> Bachors</a></li></ul></div></div>' + 
				'<div class="fba_file_editor">' + 
				'<textarea id="fba_text"></textarea></div>';
        $("#fba").html(j);
        var h = CodeMirror.fromTextArea(document.getElementById("fba_text"), {
            mode: "text/html",
            lineNumbers: true,
            theme: "material"
        });
		
			$('#fba').enhsplitter({vertical: true});
    if(g.github != undefined){
		g.github.repos.sort();
		var hh = '<ul>';
		$.each(g.github.repos, function(i, a) {
			hh += '<li class="parent"><a class="gsub" id="' + slug(g.github.user + a) + '" data-red="yes" data-repos="' + a + '" data-sub=""><i class="fa fa-folder"></i> ' + a + '</a></li>';
		});
		hh += '</ul>';
		$(hh).insertAfter('#fba_github')
	}
    $(".window").on('click', '.gsub', function(e) {
        e.preventDefault();
        $(this).parent().toggleClass('active');
        $(this).parent().children('ul').slideToggle('fast');
        if ($(this).data("red") == 'yes') {
			var k = $(this).data("repos");
			var t = $(this).data("sub");
			var a = '#' + $(this).attr("id");
            $(this).data("red", "no");
            jgrfeed_direktori(k, a, t);
        }
    });
    $(".window").on('click', '.grfile', function(e) {
        e.preventDefault();
        $('.rfile').removeClass("aktip");
        $('.grfile').removeClass("aktip");
        $(this).addClass("aktip");
        var a = $(this).data("rfile");
		var k = $(this).data("repos");
        jgrfeed_file(k, a, $(this).data("mode"))
    });
	
    function jgrfeed_direktori(k, h, cc) {
        $.ajax({
            type: "GET",
            url: 'https://api.github.com/repos/' + g.github.user + '/' + k + '/contents/' + cc,
            crossDomain: true,
            dataType: "json"
        }).done(function(c) {
            var r = "<ul>";
            $.each(c, function(i, a) {
                if (c[i].type == "dir") {
					r += '<li class="parent"><a class="gsub" id="' + slug(g.github.user + k + c[i].path) + '" data-red="yes" data-repos="' + k + '" data-sub="' + c[i].path + '"><i class="fa fa-folder"></i> ' + c[i].name + '</a></li>'
                } else {
                    var b = fba_size(c[i].size),
						s = c[i].path.substr(c[i].path.lastIndexOf(".") + 1);
                    switch (s) {	
					
						case "html":
                        case "php":
                        case "js":
                        case "css":
                        case "txt":
                        case "md":
                        case "asp":
                        case "aspx":
                        case "jsp":
                        case "py":
                        case "htaccess":
                        case "json":
							r += '<li class="parent empty"><a title="Size: ' + b + '" class="grfile" data-repos="' + k + '" data-mode="' + s + '" data-rfile="' + c[i].path + '"><i class="fa fa-file-code-o"></i> ' + c[i].name + '</a></li>';
                            break;
							
						default:
                            r += '<li class="parent empty"><a href="' + c[i].html_url + '" target="_BLANK" title="Size: ' + b + '"><i class="fa fa-cloud-download"></i> ' + c[i].name + '</a></li>'
                    }
                }
            });
            r += "</ul>";
            $(r).insertAfter(h);
        })
    }

    function jgrfeed_file(k, b, c) {
        $.ajax({
            type: "GET",
            url: 'https://raw.githubusercontent.com/' + g.github.user + '/' + k + '/master/' + b,
            crossDomain: true
        }).done(function(a) {
			fileName = b.substring(b.lastIndexOf('/')+1);
			$("#rf").html('github.com/' + g.github.user + '/' + k + '/' + b.replace(/\//ig, '/'));
            h.setValue(a);
            if (g.mode[c] != undefined) {
                h.setOption("mode", g.mode[c])
            }
        })
    }

    function fba_size(e) {
        var t = ["Bytes", "KB", "MB", "GB", "TB"];
        if (e == 0) return "0 Bytes";
        var n = parseInt(Math.floor(Math.log(e) / Math.log(1024)));
        return Math.round(e / Math.pow(1024, n), 2) + " " + t[n]
    }

    function slug(a) {
        return a.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
    }
}