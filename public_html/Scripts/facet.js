var i = 0;

$(document).ready(
        
	function(){          
		$("div.page-wrap > div.mission-text > div.container-fluid >   table.table-bordered > tbody > tr#first > td.text-center > answers").click(
			function(){
                            if (i===2){
                                document.getElementById("submit1").style.pointerEvents = "none";
                                activePic = $("div.page-wrap > div.mission-text > div.container-fluid >   table.table-bordered > tbody > tr#first > td.text-center > answers.active");
				$(activePic).removeClass("active");
				$(this).addClass("active");
                                i=0;
                                
                            }
                            if (i===0 || i===1){
                                if(i===1){document.getElementById("submit1").style.pointerEvents = "auto";}
				$(this).addClass("active");
                                i++;
                            }
                            
			}
		);
                $("div.page-wrap > div.mission-text > div.container-fluid > table#table_style > tbody > tr#third > td > im_facet").click(
                                function(){
                                        document.getElementById("submit3").style.pointerEvents = "auto";
                                        activePic = $("div.page-wrap > div.mission-text > div.container-fluid > table#table_style > tbody > tr#third > td > im_facet.active");
                                        $(activePic).removeClass("active");
                                        $(this).addClass("active");
                                }
                        );
	}
                
                
);

function facet1(){
    document.getElementById("first").style.pointerEvents = "none";
    document.getElementById("submit1").style.pointerEvents = "none";
    var ans1 = $("div.page-wrap > div.mission-text > div.container-fluid > table.table-bordered > tbody > tr > td.text-center > answers#pb").attr("class");
    var ans2 = $("div.page-wrap > div.mission-text > div.container-fluid > table.table-bordered > tbody > tr > td.text-center > answers#tp").attr("class");
    
    if(ans1==="active" && ans2==="active"){
        
    document.getElementById("ans_check").innerHTML="<div class=\"logo\"><img src=\"images/icons/right.png\"></div>";   
    document.getElementById("desc1").innerHTML="CONGRATULATIONS!";
    document.getElementById("desc1").style.color="green";
    document.getElementById("desc1").style.fontWeight="bold";
    }
    
    else {
        document.getElementById("desc1").innerHTML="<img src=\"images/icons/bulb.png\" style=\"width:40px; height:40px;\"> A pencil is related to drawing, as a paint brush is related to the verb ‘to paint’.<br>On the answer sheet answer 2 and 4 are circled.";
        document.getElementById("ans_check").innerHTML="<div class=\"logo\"><img src=\"images/icons/wrong.png\"></div>";
    }    
        document.getElementById("pbt").style.backgroundColor = "#90da47";
        document.getElementById("tpt").style.backgroundColor = "#90da47";
}       

function onin() {
    document.getElementById("submit2").style.pointerEvents = "auto";
}

function facet2(){
    document.getElementById("submit2").style.pointerEvents = "none";
    
    if(document.getElementById("numb").value==="11"){
        
    document.getElementById("ans_check2").innerHTML="<div class=\"logo\"><img src=\"images/icons/right.png\"></div>";   
    document.getElementById("desc2").innerHTML="CONGRATULATIONS!";
    document.getElementById("desc2").style.color="green";
    document.getElementById("desc2").style.fontWeight="bold";
    }
    else{
        document.getElementById("ans_check2").innerHTML="<div class=\"logo\"><img src=\"images/icons/wrong.png\"></div>"; 
        document.getElementById("desc2").innerHTML="<img src=\"images/icons/bulb.png\" style=\"width:40px; height:40px;\">This series can be completed by the number <b style=\"background-color: #90da47; padding:0 20px 0 20px;\"> 11 </b>, since the intermediate number was always left out. <br>The number 11 should be written on the answer sheet.";       
    }
}   

function facet3(){
    document.getElementById("submit3").style.pointerEvents = "none";
    document.getElementById("third").style.pointerEvents = "none";
    var ans = $("div.page-wrap > div.mission-text > div.container-fluid > table#table_style > tbody > tr#third > td > im_facet#t").attr("class");
    
    if(ans==="active"){
        
    document.getElementById("ans_check3").innerHTML="<div class=\"logo\"><img src=\"images/icons/right.png\"></div>";   
    document.getElementById("desc3").innerHTML="CONGRATULATIONS!";
    document.getElementById("desc3").style.color="green";
    document.getElementById("desc3").style.fontWeight="bold";
    }
    else{
        document.getElementById("ans_check3").innerHTML="<div class=\"logo\"><img src=\"images/icons/wrong.png\"></div>"; 
    }
    document.getElementById("t").style.boxShadow = "10px 0px 50px 45px #129303";
    document.getElementById("t").style.backgroundColor = "#129303";
} 