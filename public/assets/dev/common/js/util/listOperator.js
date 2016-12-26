define(function(require, exports,module){
	$("div[id$=StatList]").on("mouseover","div[type=toOperator]",function(){
		$(this).next().show();
	});
	$("div[id$=StatList]").on("mouseout","div[type=toOperator]",function(){
		$(this).next().hide(10);
	});
	$("div[id$=StatList]").on("mouseover","div[type=operator]",function(){
		$(this).stop().show();
		$(this).prev().attr("class","edit02");
	});
	$("div[id$=StatList]").on("mouseout","div[type=operator]",function(){
		$(this).hide();
		$(this).prev().attr("class","edit01");
	});

});