
var imIndex = 0;
var autoAnimation = true;
var imgs;

$(document).ready(
	function(){
                $("#headSect").load("menu.html");
                var hostURL='http://localhost:3000/';
                $( ".module" ).animate(  {opacity: '1'}, 1500 );
                $( ".mission-text" ).animate(  {opacity: '1'}, 2500 );
                $( ".pageheader" ).animate(  {opacity: '1'}, 1500 );
		$.post(hostURL + "getIndexPageSettings", function(data, status){
		        imgs=data.imagesForSlideshow;
		});

		$("div.module").mouseenter(
			function(){
				$("div.module > div.leftArrow").animate({left: "0px"});
				$("div.module > div.rightArrow").animate({right: "0px"});
				$("header").animate({opacity: "0"}, "fast");
				$("div.module > imgDescription").animate({top: "90%"});
				$("div.module > imgDescription > imgDscrTxt").text(imgs[imIndex].imageDescription);
			}
		);
        
		$("div.module").mouseleave(
			function(){
				$("div.module > div.leftArrow").animate({left: "-50px"});
				$("div.module > div.rightArrow").animate({right: "-50px"});
				$("header").animate({opacity: "1"});
				$("div.module > imgDescription").animate({top: "100%"}, "fast");
			}
		);

		$("div.module > div.leftArrow").click(
			function(){
				autoAnimation = false;
				$("div.module").animate({opacity:0},'slow');
				setTimeout(function(){
					if(imIndex>0){
						--imIndex;
					}else{
						imIndex = imgs.length-1;
					}
					var imName = imgs[imIndex].imageName;
					$("div.module").css("background", "url(images/home/"+imName+") no-repeat");
                                        $("div.module").css("background-size", "100%");
                                        $("div.module").css("padding-bottom", "27%");
					$("div.module > imgDescription > imgDscrTxt").text(imgs[imIndex].imageDescription);
				}, 500);
				$("div.module").animate({opacity:1},'slow');
			}
		);

		$("div.module > div.rightArrow").click(
			function(){
				autoAnimation = false;
				$("div.module").animate({opacity:0},'slow');
				setTimeout(function(){
					if(imIndex<(imgs.length-1)){
						++imIndex;
					}else{
						imIndex = 0;
					}
					var imName = imgs[imIndex].imageName;
					$("div.module").css("background", "url(images/home/"+imName+") no-repeat");
                                        $("div.module").css("background-size", "100%");
                                        $("div.module").css("padding-bottom", "27%");
					$("div.module > imgDescription > imgDscrTxt").text(imgs[imIndex].imageDescription);
				}, 500);
				$("div.module").animate({opacity:1},'slow');
			}
		);

		$("div.module > div.Arrow").hover(
			function(){
				$(this).animate({opacity:1});
			},
			function(){
				$(this).animate({opacity:0.4});
			}
		);		
	}
);

function changeImg(){
	if(imIndex<(imgs.length-1)){
		++imIndex;
	}else{
		imIndex = 0;
	}
	var imName = imgs[imIndex].imageName;
	$("div.module").css("background", "url(images/home/"+imName+") no-repeat");
        $("div.module").css("background-size", "100%");
        $("div.module").css("padding-bottom", "27%");
	$("div.module > imgDescription > imgDscrTxt").text(imgs[imIndex].imageDescription);
}

function animatedChange(){
        $("div.module").css("background-size", "100%");
        $("div.module").css("padding-bottom", "27%");
	if(autoAnimation === true){
		$("div.module").animate({opacity:0},'slow');
		setTimeout(changeImg, 500);
		$("div.module").animate({opacity:1},'slow');
	}
}

setInterval(animatedChange, 30000);
setInterval(function(){autoAnimation=true}, 60000);
