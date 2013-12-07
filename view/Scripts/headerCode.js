$(document).ready(function() {
	$("ul#nav li a").addClass("js");
	$("ul#nav li a").hover(
      function () {
        $(this).stop(true,true).animate({"background":"(0 0)"}, 200);
        $(this).animate({"background-position":"(0 -5px)"}, 150);
      }, 
      function () {
        $(this).animate({"background-position":"(0 -149px)"}, 200);

      }
    );

});