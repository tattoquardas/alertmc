var numToName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var genCalendar = function(){
			var month = $("div.container-fluid > div#calender > div#calenderHeader > form > div.row > div.col-xs-2 > select#month").val();
			var year = $("div.container-fluid > div#calender > div#calenderHeader > form > div.row > div.col-xs-1 > select#year").val();
			var m = [[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1], [-1,-1,-1,-1,-1,-1,-1]];
			var currWeek = 0;
			var d = new Date(year, month);
			for(var i=1; i<=31; ++i){
				d.setDate(i);
				if(d.getMonth()!=month){
					break;
				}
				var day = d.getDay();
                                if(day==0){
                                    day = 6;
                                } else {
                                    day--;
                                }
				m[currWeek][day] = i;
				if(day==6){
					++currWeek;
				}
			}
			var c = 0;
			for(var i = 0; i<m[m.length-1].length; ++i){
				if(m[m.length-1][i]==-1){
					++c;
				}
			}
			if(c==7){
				m.length--;
			}
			var text = "<tr>";
			for(var i=0; i<m.length; ++i){
				for(j=0; j<m[i].length; ++j){
					if(m[i][j]==-1){
						text+="<td style=\"width: 14.3%;\"><div class=\"cell\"><center><hr width=40%></center></div></td>";
					}else{
						text+="<td style=\"width: 14.3%;\" class=\"nonempty-cell\" id=\""+year+month+m[i][j]+"\"><div class=\"cell\"><center>"+m[i][j]+"<div class=\"eventName\">No events</div><hr width=40%></center></div></td>"
					}
				}
				text+="</tr>";
				if(i<(m.length-1)){
					text+="<tr>";
				}
			}
			$("div.container-fluid > div#calender > div.row > div#calenderTable > table > tbody#dates").html(text);

			$("div.container-fluid > div#calender > div.row > div#calenderTable > table > tbody#dates > tr > td.nonempty-cell").hover(
				function(){
					this.colorBuffer = $(this).css("backgroundColor");
					$(this).css({background: "#888888"});
				},

				function(){
					$(this).css({background: this.colorBuffer});
				}
			);

		}

$(document).ready(
	function(){
		$("#headSect").load("menu.html");
//-------------------------------------------------------------------------------------------------------------------------------------------
		var monthList = $("div.container-fluid > div#calender > div#calenderHeader > form > div.row > div.col-xs-2 > select#month");
		$(monthList).append($('<option>', {value:0, text:"January"}));
		$(monthList).append($('<option>', {value:1, text:"February"}));
		$(monthList).append($('<option>', {value:2, text:"March"}));
		$(monthList).append($('<option>', {value:3, text:"April"}));
		$(monthList).append($('<option>', {value:4, text:"May"}));
		$(monthList).append($('<option>', {value:5, text:"June"}));
		$(monthList).append($('<option>', {value:6, text:"July"}));
		$(monthList).append($('<option>', {value:7, text:"August"}));
		$(monthList).append($('<option>', {value:8, text:"September"}));
		$(monthList).append($('<option>', {value:9, text:"October"}));
		$(monthList).append($('<option>', {value:10, text:"November"}));
		$(monthList).append($('<option>', {value:11, text:"December"}));
//---------------------------------------------------------------------------------------------------------------------------------------------
		var yearList = $("div.container-fluid > div#calender > div#calenderHeader > form > div.row > div.col-xs-1 > select#year");
		for(var y = 2016; y<=2050; ++y){
			$(yearList).append($('<option>', {value:y, text:y}));
		}
//---------------------------------------------------------------------------------------------------------------------------------------------
		var curDate = new Date();
		$(monthList).val(parseInt(curDate.getMonth()));
		$(yearList).val((curDate.getFullYear()));
		$("#selectedMonth").text(""+numToName[curDate.getMonth()]+", "+curDate.getFullYear());
//---------------------------------------------------------------------------------------------------------------------------------------------
		$("button#showButton").click(
			function(){
				genCalendar();
				var month = $("div.container-fluid > div#calender > div#calenderHeader > form > div.row > div.col-xs-2 > select#month").val();
				var year = $("div.container-fluid > div#calender > div#calenderHeader > form > div.row > div.col-xs-1 > select#year").val();
				$("#selectedMonth").text(""+numToName[month]+", "+year);
			}
		);
//---------------------------------------------------------------------------------------------------------------------------------------------
		genCalendar();
//---------------------------------------------------------------------------------------------------------------------------------------------
	}
);
