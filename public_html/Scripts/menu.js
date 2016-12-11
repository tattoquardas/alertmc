var urlToId	=	{
				"index.html" : "home",
				"training.html" : "training",
				"hr.html" : "hr",
				"forum.html" : "forum",
				"contacts.html" : "contacts",
                                "about_us.html" : "about"
			};
                        
function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

$(document).ready(
	function(){
		var page = (window.location.pathname.split("/")).pop();
                if(page.length<=0){
                    page = "index.html";
                }
                console.log(page);
                var cache = {};
		$("div#headSect > div.menuSect > ul.a > li > a.active").removeClass("active");
		$("div#headSect > div.menuSect > ul.a > li > a#"+urlToId[page]).addClass("active");
		if($("div#headSect > div.menuSect > ul.a > li > a.active").length === 0){
			$("a[href='"+page+"']").parent().parent().find("a:first").addClass("active");
		}
                
                var l = readCookie("lang");
                console.log(l);
                
                if(l==null){
                    createCookie("lang", "en")
                }else{
                    $("div#headSect > div.langSect > ul.b > ul > li > b.active").removeClass("active");
                    $("div#headSect > div.langSect > ul.b > ul > li > b#" + l).addClass("active");
                    if(l!="en"){
                        if(!("en" in cache)){
                            cache["en"] = [];
                            $(".localize").each(function( index ){
                                cache["en"].push($(this).html());
                            });
                        }
                        
                        var translation = [];
                        if(!(l in cache)){
                            var hostURL='http://localhost:3000/';
                            $.get(hostURL + "localization?page="+page.split(".")[0]+"&lang="+l, function(data, status){
                                translation=data;
                                $(".localize").each(function( index ){
                                    $(this).html(translation[index]);
                                });                                        
                            }).fail(function(){
                                alert("There is no translation");
                               });
                        } else {
                            $(".localize").each(function( index ){
                                $(this).html(cache[l][index]);
                            });
                        }
                    }
                }
                
		$("div#headSect > div.langSect > ul.b > ul > li > b").click(
			function(){
                            activeLang = $("div.langSect > ul.b > ul > li > b.active");
                            var newLang = this;
                            if($(activeLang).attr("id") !== $(newLang).attr("id")){
				$(activeLang).removeClass("active");
				$(newLang).addClass("active");
                                if(!($(activeLang).attr("id") in cache)){
                                    cache[$(activeLang).attr("id")] = [];
                                    $(".localize").each(function( index ){
                                        cache[$(activeLang).attr("id")].push($(this).html());
                                    });
                                }
                                var translation = [];
                                if(!($(newLang).attr("id") in cache)){
                                    var hostURL='http://localhost:3000/';
                                    $.get(hostURL + "localization?page="+page.split(".")[0]+"&lang="+$(newLang).attr("id"), function(data, status){
                                        translation=data;
                                        $(".localize").each(function( index ){
                                            $(this).html(translation[index]);
                                        });                                        
                                    }).fail(function(){
                                        alert("There is no translation");
                                    });
                                } else {
                                    $(".localize").each(function( index ){
                                        $(this).html(cache[$(newLang).attr("id")][index]);
                                    });
                                }
                                createCookie("lang", $(newLang).attr("id"));
                            }
			}
		);

		$("div#headSect > div.menuSect > ul.a > li.dropdown").hover(
			function(){
				$(this).find("ul.dropdown-content").css({display: "block"});
				$(this).find("ul.dropdown-content").animate({opacity: "1"}, 600);
			},
			function(){
				$(this).find("ul.dropdown-content").animate({opacity: "0"}, 600);
				$(this).find("ul.dropdown-content").css({display: "none"});	
			}
		);

	}
);
