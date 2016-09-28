var urlToId	=	{
				"index.html" : "home",
				"training.html" : "training",
				"hr.html" : "hr",
				"forum.html" : "forum",
				"contacts.html" : "contacts",
                                "about_us.html" : "about"
			};

$(document).ready(
	function(){
		var page = (window.location.pathname.split("/")).pop();
                var cache = {};
		$("div#headSect > div.menuSect > ul.a > li > a.active").removeClass("active");
		$("div#headSect > div.menuSect > ul.a > li > a#"+urlToId[page]).addClass("active");
		if($("div#headSect > div.menuSect > ul.a > li > a.active").length === 0){
			$("a[href='"+page+"']").parent().parent().find("a:first").addClass("active");
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
