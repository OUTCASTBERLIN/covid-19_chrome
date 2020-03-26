//Code by Roel van Roozendaal / roelroozendaal.com
//SET VARIABLES
var country;
country = $("#countrylist").val();
var casesGermanyUrl = null;
var selCountryCode = null;

//START BUILDING THE OUTPUT ONCE THE DEFAULTS ARE LOADED
$(document).ready(function(){
  //IF THERE IS NO COOKIE SET DEFAULT TO GERMANY (DEU)
  if(getCookie('myCountry') == null || getCookie('myCountry') == undefined || getCookie('myCountry') == "") {
    setCookie('myCountry',$("#countrylist").countrySelector({ value: 'DEU' }),'10');
  }

  selectedCountry = getCookie('myCountry'); //$("#countrylist :selected").val();
  $("#countrylist").countrySelector({ value: selectedCountry });

  $(".tabs-list li a").click(function(e){
     e.preventDefault();
  });

  $(".tabs-list li").click(function(){
     var tabid = $(this).find("a").attr("href");
     $(".tabs-list li,.tabs div.tab").removeClass("active");
     $(".tab").hide();
     $(tabid).show();
     $(this).addClass("active");
  });
});

//LOAD DEFAULT DATA (GERMANY) ON PAGE READY
$(document).ready(loadCovidData);
$(document).ready(loadCovidWorldData);

//RELOAD WHEN NEW COUNTRY IS SELECTED
$("#countrylist").on("change",function(){
  eraseCookie('myCountry');
  loadCovidData();
});

//
//FUNCTIONS
//
//FUNCTION TO LOAD THE COVID DATA
function loadCovidData( jQuery ) {
  setCookie('myCountry',$("#countrylist :selected").val(),'10')
  casesUrl = "https://covid19.mathdro.id/api/countries/"+getCookie('myCountry');

  $.getJSON(casesUrl, function(data) {
    var items = [];
  
    $.each(data, function(key, val) {
      if(key == 'lastUpdate') {
        //items.push("<br/><i>last updated: " + val + "</i>");
      }else{
        items.push( "<div id='" + key + "'>" + key + ": " + val.value+ "</div>" );
        console.log(key);

        //UPDATE EXTENTION ICON NUMBER
        if(key == "confirmed")
        {
          //SURE ITS A CHROME EXTENTION BUT WE ALSO WANT TO USE IT IN SAFARI!
          if(typeof(chrome) == "object") {
            if(typeof(chrome.browserAction) == "object") {
              chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
              chrome.browserAction.setBadgeText({text: val.value.toString()});
              chrome.browserAction.setTitle({title: val.value.toString() + " CASES IN " + $("#countrylist :selected").text()});
            }
          }
        }
      }
    });
    $("#data-list").remove();
    $("<div id='data-list'><h2>"+ $("#countrylist :selected").text() + "</h2>" + items.join("")+"</div>").appendTo('#country');
  });
}

//ADD TOTALS
function loadCovidWorldData( jQuery ) {
  casesUrl = "https://covid19.mathdro.id/api/";

  $.getJSON(casesUrl, function(data) {
    var items = [];

    $.each(data, function(key, val) {  
      if(key == 'lastUpdate') {
        items.push("<br/><i>last updated: " + val + "</i>");
      }else{
        if(key == "confirmed"){    
          items.push( "<div id='" + key + "'><h2>WORLD</h2> confirmed: " + val.value+ "</div>" );
          console.log(key);
        }
      }
    });
    $("#world-data-list").remove();
    $("<div id='world-data-list'>"+items.join("")+"</div><br/>").appendTo('#world');
  });
}

//DEAL WITH COOKIES TO SET A DEFAULT COUNTRIE
function setCookie(key, value, expiry) {
  var expires = new Date();
  expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
  document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
  var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
  return keyValue ? keyValue[2] : null;
}

function eraseCookie(key) {
  var keyValue = getCookie(key);
  setCookie(key, keyValue, '-1');
}

//LOAD NEW DATA EVERY 10 MIN
setInterval(function(){
  loadCovidData();
}, 600000);


//$("#countrylist :selected").text();


