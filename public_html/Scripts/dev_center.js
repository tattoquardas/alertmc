var a = ['emp', 'ass'];

$(document).ready(
	function(){
            for(var i=1; i<a.length; ++i){
           $("#"+a[i]).hide();
        }
        $("dev_center").click(
			function(){                               
				activePic = $("dev_center.active");
				$(activePic).removeClass("active");
				$(this).addClass("active");
                            }
                    ); 
    }
);

function show(id)
{
   $("#"+id).show(1000);
    
   for(var i=0; i<a.length; ++i){
       if(a[i] !== id){
           $("#"+a[i]).hide(1000);
       }
   }
}