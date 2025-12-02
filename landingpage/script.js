window.addEventListener("hashchange", function() {
    
  if(location.hash === "#home"){
      document.getElementById("privacyDiv").style.display = "none";
      document.getElementById("homeDiv").style.display = "block";
      document.getElementById("aboutDiv").style.display = "none";
      document.getElementById("termsDiv").style.display = "none";
      document.getElementById("aaBDiv").style.display = "none";
  }
   else if(location.hash === "#privacy"){
      document.getElementById("homeDiv").style.display = "none";
      document.getElementById("privacyDiv").style.display = "block";
      document.getElementById("aboutDiv").style.display = "none";
      document.getElementById("termsDiv").style.display = "none";
      document.getElementById("aaBDiv").style.display = "none";
  }
   else if(location.hash === "#about"){
      document.getElementById("homeDiv").style.display = "none";
      document.getElementById("privacyDiv").style.display = "none";
      document.getElementById("termsDiv").style.display = "none";
      document.getElementById("aboutDiv").style.display = "block";
      document.getElementById("aaBDiv").style.display = "none";
  }
   else if(location.hash === "#analytics&adblocker"){
      document.getElementById("homeDiv").style.display = "none";
      document.getElementById("privacyDiv").style.display = "none";
      document.getElementById("termsDiv").style.display = "none";
      document.getElementById("aboutDiv").style.display = "none";
      document.getElementById("aaBDiv").style.display = "block";
  }

   else{
       console.log('Page not found');
   }
});


/*    else if(location.hash === "#terms"){
      document.getElementById("homeDiv").style.display = "none";
      document.getElementById("privacyDiv").style.display = "none";
      document.getElementById("aboutDiv").style.display = "none";
      document.getElementById("termsDiv").style.display = "block";
      document.body.style.backgroundColor = "whitesmoke";
      document.getElementById("navDiv").style.display = "block";
  }
    else if(location.hash === "#algo"){
      document.getElementById("homeDiv").style.display = "none";
      document.getElementById("privacyDiv").style.display = "none";
      document.getElementById("aboutDiv").style.display = "none";
      document.getElementById("termsDiv").style.display = "none";
      document.getElementById("termsDiv").style.display = "none";
      document.body.style.backgroundColor = "whitesmoke";
      document.getElementById("navDiv").style.display = "block";
      document.getElementById("algoDiv").style.display = "block";
  }*/

//////////////////////////////////////
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}
/////////////////////////////

//Cookie Script


(function () {
  
  var infoBar = document.querySelector(".cookies-infobar");
  var btnAccept = document.querySelector("#cookies-infobar-close");

  // Check if user has already accepted the notification
  if(wasAccepted()) {
    hideInfobar();
    return;
  }

  //listen for the click event on Accept button
  btnAccept.addEventListener("click", function (e) {
    e.preventDefault();
    hideInfobar();
    saveAcceptInCookies(7);
  });

  //hide cookie info bar
  function hideInfobar () {
    infoBar.className = infoBar.classList.value + " cookies-infobar_accepted";
  }

  // Check if user has already accepted the notification
  function wasAccepted () {
    return checkCookie() === "1";
  }

  // get cookie
  function checkCookie () {
    var name = "cookieInfoHidden=";
    var cookies = document.cookie.split(';');

    for(var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0)==' ') {
          cookie = cookie.substring(1);
        }

        if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
  };

  //save cookie
  function saveAcceptInCookies (daysOfValidity) {
    var now = new Date();
    var time = now.getTime() + (daysOfValidity * 24 * 60 * 60 * 1000);
    var newTime = new Date(now.setTime(time));
    
    newTime = newTime.toUTCString();
    
    document.cookie = "cookieInfoHidden=1; expires=" + newTime + "; path=/";
  }

})();