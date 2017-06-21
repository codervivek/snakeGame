  $(document).ready(function() {
    $('select').material_select();
  });

var option=document.getElementById("option");
option.onchange = function(){
    localStorage.setItem("nop",option.value);
};