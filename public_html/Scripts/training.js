$(document).ready(
	function(){
                $("#headSect").load("../menu.html");
		$("div#headSect > div.menuSect > ul.a > li > a.active").removeClass("active");
		$("div#headSect > div.menuSect > ul.a > li > a#training").addClass("active");	
	}
);
