$(document).foundation();
$('#project-switching-interface').hide();

$('.project-switcher').on("click", function() {
  var curText = $(this).text();
  $('#project-switching-interface').slideToggle(500);
  if (curText == "Check out a different project") {
    $(this).text("Close project list");
  } else {
    $(this).text("Check out a different project");
  }
});
