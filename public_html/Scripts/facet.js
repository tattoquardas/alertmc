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
    
    if(ans1==="localize active" && ans2==="localize active"){
        
    document.getElementById("ans_check").innerHTML="<div class=\"logo\"><img src=\"images/icons/right.png\"></div>";   
    document.getElementById("desc1").innerHTML="CORRECT!";
    document.getElementById("desc1").style.color="green";
    document.getElementById("desc1").style.fontWeight="bold";
    }
    
    else {
        var language = readCookie("lang");        
        if(language=="en"){
            document.getElementById("desc1").innerHTML="Wrong answer: The right solution is answer 2 and 4. <br>A pencil is related to drawing, as a paint brush is related to the verb ‘to paint’.";
        }
        else if(language=="nl"){
            document.getElementById("desc1").innerHTML=" Fout antwoord: de juiste oplossing is antwoord 2 en 4. <br>En potloot is gerelateerd met tekenen zoals een penseel met schilderen.";
        }
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
    document.getElementById("desc2").innerHTML="CORRECT!";
    document.getElementById("desc2").style.color="green";
    document.getElementById("desc2").style.fontWeight="bold";
    }
    else{
        document.getElementById("ans_check2").innerHTML="<div class=\"logo\"><img src=\"images/icons/wrong.png\"></div>"; 
        var language = readCookie("lang");        
        if(language=="en"){
            document.getElementById("desc2").innerHTML="Wrong answer: The right solution is  <b style=\"background-color: #90da47; padding:0 20px 0 20px;\"> 11 </b>. <br>This series an be completed by the number 11, since the intermediate number was always left out.";
        }   
        else if(language=="nl"){
            document.getElementById("desc2").innerHTML="Fout antwoord: de juiste oplossing is <b style=\"background-color: #90da47; padding:0 20px 0 20px;\"> 11 </b>. <br>Deze reeks kan worden aangevuld met het nummer 11 aangezien de even nummers werden weggelaten.";
        }
    }
}   

function facet3(){
    document.getElementById("submit3").style.pointerEvents = "none";
    document.getElementById("third").style.pointerEvents = "none";
    var ans = $("div.page-wrap > div.mission-text > div.container-fluid > table#table_style > tbody > tr#third > td > im_facet#t").attr("class");
    
    if(ans==="active"){
        
    document.getElementById("ans_check3").innerHTML="<div class=\"logo\"><img src=\"images/icons/right.png\"></div>";   
    document.getElementById("desc3").innerHTML="CORRECT!";
    document.getElementById("desc3").style.color="green";
    document.getElementById("desc3").style.fontWeight="bold";
    }
    else{
        document.getElementById("ans_check3").innerHTML="<div class=\"logo\"><img src=\"images/icons/wrong.png\"></div>"; 
        var language = readCookie("lang");        
        if(language=="en"){
        document.getElementById("desc3").innerHTML="Wrong answer: the right solution is cube number 2.";
    } else if(language=="nl"){
        document.getElementById("desc3").innerHTML="Fout antwoord: de juiste oplossing is kubus nummer 2.";
    }
    
    }
    document.getElementById("t").style.boxShadow = "10px 0px 50px 45px #129303";
    document.getElementById("t").style.backgroundColor = "#129303";
} 