$(document).ready(
	function(){
		$("div.mission-text > div.container-fluid > div.table-responsive > center >table.table-striped > tbody > tr > td > div#1 > im_alti").click(
			function(){
				activePic = $("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div#1 > im_alti.active");
				$(activePic).removeClass("active");
				$(this).addClass("active");
                                
                                var green_let1 = { "e":"<im_alti id=\"p\"><img src=\"images/letters/ecol.png\" /></im_alti>", 
                                    "i" : "<im_alti id=\"p\"><img src=\"images/letters/Icol.png\" /></im_alti>"
                                };
                                var id1=$("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div#1 > im_alti.active").attr("id");
                                document.getElementById("box1").innerHTML = green_let1[id1];
                                
                                if(showText()===true){
                                   alti();
                                }
			}
		);
                $("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div#2 > im_alti").click(
			function(){
				activePic = $("div.mission-text > div.container-fluid > div.table-responsive > center > table.table-striped > tbody > tr > td > div#2 > im_alti.active");
				$(activePic).removeClass("active");
				$(this).addClass("active");
                                
                                var green_let2 = { "s":"<im_alti id=\"p\"><img src=\"images/letters/scol.png\" /></im_alti>", 
                                    "n" : "<im_alti id=\"p\"><img src=\"images/letters/ncol.png\" /></im_alti>"
                                };
                                var id2=$("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div#2 > im_alti.active").attr("id");
                                document.getElementById("box2").innerHTML = green_let2[id2];
                                
                                if(showText()===true){
                                   alti();
                                }
			}
		);
                $("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div#3 > im_alti").click(
			function(){
				activePic = $("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div#3 > im_alti.active");
				$(activePic).removeClass("active");
				$(this).addClass("active");
                                
                                var green_let3 = { "t":"<im_alti id=\"p\"><img src=\"images/letters/tcol.png\" /></im_alti>", 
                                    "f" : "<im_alti id=\"p\"><img src=\"images/letters/fcol.png\" /></im_alti>"
                                };
                                var id3=$("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div#3 > im_alti.active").attr("id");
                                document.getElementById("box3").innerHTML = green_let3[id3];
        
                                if(showText()===true){
                                    alti();
                                }
			}
		);
                $("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div#4 > im_alti").click(
			function(){
				activePic = $("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div#4 > im_alti.active");
				$(activePic).removeClass("active");
				$(this).addClass("active");
                                
                                var green_let4 = { "j":"<im_alti id=\"p\"><img src=\"images/letters/jcol.png\" /></im_alti>", 
                                    "p" : "<im_alti id=\"p\"><img src=\"images/letters/pcol.png\" /></im_alti>"
                                };
                                var id4=$("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div#4 > im_alti.active").attr("id");
                                document.getElementById("box4").innerHTML = green_let4[id4];
                                
                                if(showText()===true){
                                    alti();
                                }
			}
		);
	}
);

function showText(){
    return $("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div> im_alti.active").length===4;
}

function alti(){
    
        var text = { 
            "istj":"- Logical, analytic and determined. \n\
                    <br>- They love working with much detail and organized and possess a faultless memory. \n\
                    <br>- They are working very accurately and are dutiful. \n\
                    <br>- They find it important to finish their tasks in time. \n\
                    <br>- Their decisions and actions are based on experiences in the past. \n\
                    <br>- They are reserved.", 
        
            "isfj" : "- Empathic, thoughtful, modest, hold to respect and collective well-being. \n\
                    <br>- Have sense of responsibility and need to become engaged personally.\n\
                    <br>- Are reliable and dedicated and create structures for the use of people.\n\
                    <br>- When solving problemsthey appeal to the past.", 
        
            "intj": "- Observe the organization for which they work and their environment in a perceptive way. \n\
                    <br>- Discover new models. \n\
                    <br>- Have a clear look at the future and trust their own possibilities. \n\
                    <br>- Act after having analysed and set in a context all possibilities. \n\
                    <br>- Develop logical and comprehensible systems.", 
        
            "infj": "- Radiate personal warmth, are enthusiastic, possess an enormous power of concentration and organizing abilities. \n\
                    <br>- Organize the outer world in function of their personal values. \n\
                    <br>- Understand and often meet the needs of others. \n\
                    <br>- Changing stimulates them to develop and apply possibilities.", 
        
            "istp": "- Observe their direct environment in a perceptive way. \n\
                    <br>- Solve problems in a logical, analytical and practical way. \n\
                    <br>- Are prepared to take risks and adapt themselves very easily.\n\
                    <br>- Are able to get through a lot of data.", 
        
            "isfp": "- Friendly, careful,sympathetic. \n\
                    <br>- They are modest about their qualities. \n\
                    <br>- They have their own ideals and love to take action.\n\
                    <br>- They can be persuasive, are practically oriented and have a great adaptability.\n\
                    <br>- They have an eye for details and are precise and scrupulously careful in their job.",
        
            "infp": "- Possess profound values towards people and the development of human potential. \n\
                    <br>- Are loyal and defenders of good business. \n\
                    <br>- Radiate a peaceful carefulness and attach importance to harmonious relations with other people.\n\
                    <br>- They are creative and work with energy and enthusiasm to find solutions.",
            
            "intp": "- Love to analyse and order things in a logical way. \n\
                    <br>- Find creative solutions for problems and emphasize renewal of things. \n\
                    <br>- Interest in ideas and theories.\n\
                    <br>- Don't like \"social concern\".\n\
                    <br>- Prefer working alone.",
            
            "estp": "- Solve problems in a pragmatic and realistic way and put results first and foremost. \n\
                    <br>- They love excitement and action and don't evade risks. \n\
                    <br>- Share their enthusiasm with others and adapt spontaneously to new situations.\n\
                    <br>- Associate in a spontaneous and sometimes impulsive way with their environment.",
        
            "esfp": "- Are practically oriented and realistic. \n\
                    <br>- Like to be surrounded by people and look for social contact. \n\
                    <br>- Express themselves in a very expressive and enthusiastic way and always love to do what's best.\n\
                    <br>- Like to experience new things or to put them into practice.",
        
            "enfp": "- Are enthusiastic and possess plenty of creative ideas. \n\
                    <br>- Approach matters in an energetic way and help other people spontaneously with solving problems or with their personal or professional development. \n\
                    <br>- They have a lot of interests and adopt a warm and concerned attitude towards their environment.",
        
            "entp": "- They are enterprising and inventive, often a little bit opinionated.\n\
                    <br>- They love discussions and enjoy explaining their complex vision of their future and variety of ideas.\n\
                    <br>- They are keen on new challenges, which they analyse and approach creative way.\n\
                    <br>- They prefer capability to status.",
        
            "estj": "- Are active and dutiful organizers, who love to take responsibility to carry affairs to a successful conclusion.\n\
                    <br>- They are working hard and efficiently and try to find practical solutions for problems.\n\
                    <br>- They have an analytical view on the way systems work.\n\
                    <br>- They are very often assertive and it's difficult to upset them.",
        
            "esfj": "- They are careful, social and realistic.\n\
                    <br>- They like and take care for harmony and group loyalty.\n\
                    <br>- Attach great importance to traditions and structure.\n\
                    <br>- Apprehend the needs of other people often spontaneously and try to find with a lot of creativeness and enthusiasm a practical solution for it.",
            
            "enfj": "- They are upright and willing to help.\n\
                    <br>- They often get the best out of people and stimulate others to discover their limits and to extend them.\n\
                    <br>- They create a pleasant atmoshpere and try to find a compromise between consensus and result.\n\
                    <br>- Their example is catching and provides a lot of energy.",
        
            "entj": "- Are impassioned and determined and spontaneously take the lead.\n\
                    <br>- They often have a view that they realize in a strategic and logical way.\n\
                    <br>- They easily practice.\n\
                    <br>- They really attach great importance to competencies and independence.\n\
                    <br>- They spontaneously search for intellectual challenges."
        };
        
        var ei = { "e":"Extraversion", 
            "i" : "Intraversion"
        };
        
        var sn = { "s":"Sensing", 
            "n" : "iNtuintion"
        };
        
        var tf = { "t":"Thinking", 
            "f" : "Feeling"
        };
        
        var jp = { "j":"Judging", 
            "p" : "Perseiving"
        };

        var id1=$("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div#1 > im_alti.active").attr("id");      
        var id2=$("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div#2 > im_alti.active").attr("id");      
        var id3=$("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div#3 > im_alti.active").attr("id");       
        var id4=$("div.mission-text > div.container-fluid > div.table-responsive > center >  table.table-striped > tbody > tr > td > div#4 > im_alti.active").attr("id");
       
        var key=id1+id2+id3+id4;
        document.getElementById("text").innerHTML = text[key];
        
        
}