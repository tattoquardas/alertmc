var a = ['pi', 'pm', 'sal', 'led', 'prof'];

$(document).ready(
	function(){
            for(var i=1; i<a.length; ++i){
           $("#"+a[i]).hide();
        }
        $("koan").click(
			function(){                               
				activePic = $("koan.active");
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