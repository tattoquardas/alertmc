$(document).ready(
	function(){
		$("#headSect").load("menu.html");
		
		$("img#showCreateTopicForm").click(
			function(){
				$("div#createTopic").modal();
			}
		);
	}
);
