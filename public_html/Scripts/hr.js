var dim = [["10", "11", "12", "13", "14", "15", "16", "17", "18"], 
    ["10", "11", "12", "15", "16", "17", "18"], 
    ["12", "18"], 
    ["11", "15"], 
    ["10", "17", "18"], 
    ["10", "12", "17", "18"], 
    ["10", "17", "18"], 
    ["10", "11", "13", "14", "15", "18"], 
    ["13", "15", "16"],
    ["10"],

    
    ["1", "4", "5", "6", "7", "9"],
    ["1", "3", "7"],
    ["1", "2", "5"],
    ["7", "8"],
    ["7"],
    ["1", "3","7", "8"],
    ["1","8"],
    ["1", "4", "5", "6"],
    ["1", "2", "5", "4", "7", "6"],
    ["1", "2", "3", "4", "5", "6", "7", "8", "9"]];

var anim = { 1: 5, 
            2 : 35,
            3 : 55,
            4 : 15,
            5 : 45,
            6 : 85,
            7 : 25,
            8 : 65,
            9 : 75};

$(document).ready(
        function(){
                picanim();
                $("pics").click(
			function(){
                                activePic = $("dimen.active");
				$(activePic).removeClass("active");
                                
				activePic = $("pics.active");
				$(activePic).removeClass("active");
				$(this).addClass("active");
                                var id=$("pics.active").attr("id");
                                for(var i=0; i < dim[id].length; i++)
                                {
                                    $("dimen#"+dim[id][i]).addClass("active")
                                }
                            }
                );
                $("dimen").click(
			function(){
                                activePic = $("pics.active");
				$(activePic).removeClass("active");
                                
				activePic = $("dimen.active");
				$(activePic).removeClass("active");
				$(this).addClass("active");
                                var id=$("dimen.active").attr("id");
                                for(var i=0; i < dim[id].length; i++)
                                {
                                    $("pics#"+dim[id][i]).addClass("active")
                                }
                            }
                );
            }
      
  );
  
  function picanim(){
      for (var i=0; i < 10; i++)
      $( "pics#"+i ).animate(  {opacity: '1', left: anim[i]+"%"}, 3500 );
  }