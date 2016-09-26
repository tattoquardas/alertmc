var app = angular.module("testApp", []);
	app.controller("testController", function($scope, $http){
		$scope.hostURL = "https://agile-waters-10164.herokuapp.com/";
		$scope.getParam = function(name, url){
 	               if (!url)
   	                    url = window.location.href;
                       name = name.replace(/[\[\]]/g, "\\$&");
                       var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                       results = regex.exec(url);
 	               if (!results)
        	               return null;
                       if (!results[2])
                               return '';
                       return decodeURIComponent(results[2].replace(/\+/g, " "));
                }
		$scope.generateTest = function(){
			$scope.data = {
				"A" : [],
				"B" : [],
				"C" : [],
				"D" : [],
				"E" : []
			};
			$scope.testState = {
				"A" : {},
				"B" : {},
				"C" : {},
				"D" : {},
				"E" : {}
			}
			$scope.headers = {};
                        $http.get($scope.hostURL + "getPolyglotHeaders?lang=" + $scope.getParam("lang")).then(function(response){
                            $scope.headers = response.data;
                        });
			$scope.answers = {};
			$scope.getQuestionsByLevel = function(level){
				$http.get($scope.hostURL + "getQuestionsForPoliglot?level="+ level +"&lang=" + $scope.getParam("lang")).then(function(response){
					$scope.data[level] = response.data;
					for(var i = 0; i<$scope.data[level].length; ++i){
						$scope.data[level][i].q_id = $scope.data[level][i].q_id.split(" ").join("");
						$scope.answers[$scope.data[level][i].q_id] = [];
						$http.get($scope.hostURL + "getAnswersForPoliglot?q_id=" + $scope.data[level][i].q_id).then(
							function(response){
								if(response.data !== undefined && response.data.length>0){
									var q_id = response.data[0].q_id.split(" ").join("");
									$scope.answers[q_id] = response.data;
									$scope.testState[level][q_id] = "none";
								}
							}
						);
					}
				});
			}
			$scope.getQuestionsByLevel("A");
			$scope.getQuestionsByLevel("B");
			$scope.getQuestionsByLevel("C");
			$scope.getQuestionsByLevel("D");
			$scope.getQuestionsByLevel("E");
		}
		$scope.generateTest();
		$scope.submitClicked = false;
		$scope.startTimer = function(duration, display) {
		    var timer = duration, minutes, seconds;
		    var interval = setInterval(function () {
			minutes = parseInt(timer / 60, 10);
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			display.textContent = minutes + ":" + seconds;

			if (--timer < 0) {
			    clearInterval(interval);
			    document.getElementById("test").innerHTML="Test is finished. Thank you for your time!";
			    document.getElementById("time").style.display="none";
			    document.getElementById("let").style.display="none";
			    if($scope.submitClicked === false){
				    console.log("timer stoped");
				    $http.post($scope.hostURL + 'DataForPoliglotTest?label='+$scope.getParam("label"), $scope.testState);
			    }
			}
		    }, 1000);
		}
		$scope.timer = function(){
		    document.getElementById("comment_form").style.display="none";
		    document.getElementById("let").style.display="block";
		    var Minutes = 60,
		    display = document.querySelector('#time');
		    $scope.startTimer(Minutes, display);
		    $("let#A").trigger('click');
		}
		$(document).ready(
			function(){
				$("div.page-wrap > div#let > let").click(
					function(){
						activePic = $("div.page-wrap > div#let > let.active");
						$(activePic).removeClass("active");
						$(this).addClass("active");
					}
				);
				$("input#start").click(
					function(){
						$scope.timer();
					}
				);
				$("let").click(
					function(){
						var s = $(this).attr("id");
						var htmlSTR = "<part>" + $scope.headers[s] + "</part>";
						for(var i = 0; i<$scope.data[s].length; ++i){
							htmlSTR += '<fieldset id="group' + (i+1) + '">';
							htmlSTR += '<div id="' + $scope.data[s][i].q_id + '">' + (i+1) + '. ' + $scope.data[s][i].question;
							for(var j = 0; j<$scope.answers[$scope.data[s][i].q_id].length; ++j){
								htmlSTR += '<br><input type="radio" value="' + $scope.answers[$scope.data[s][i].q_id][j].a_id.split(" ").join("") + '" name="group'+ (i+1) +'"';
								if($scope.testState[s][$scope.data[s][i].q_id] !== 'none' && $scope.testState[s][$scope.data[s][i].q_id] ===$scope.answers[$scope.data[s][i].q_id][j].a_id.split(" ").join("")){
									htmlSTR += " checked";
								}
								htmlSTR += '>' + $scope.answers[$scope.data[s][i].q_id][j].answer;
							}
							htmlSTR += '</div></fieldset>';
						}
						htmlSTR += '<div class="comm" id="comment_form" style="text-align: center;"><c><input type="submit" name="submit" value="Submit"></c></div>';
						document.getElementById("test").innerHTML = htmlSTR;
						$("input:radio").click(
							function(){
								var a_id = $(this).attr("value");
								var q_id = $(this).parent().attr("id");
								$scope.testState[s][q_id] = a_id;
							}
						);
						$("input:submit").click(
							function(){
				                                console.log("button clicked");
								$scope.submitClicked = true;
							        document.getElementById("test").innerHTML="Test is finished. Thank you for your time!";
							        document.getElementById("time").style.display="none";
							        document.getElementById("let").style.display="none";
				                                $http.post($scope.hostURL + 'DataForPoliglotTest?label='+$scope.getParam("label"), $scope.testState);
							}
						);
					}
				);
			}
		);
	});
