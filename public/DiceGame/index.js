const pageAccessedByReload = (
  (window.performance.navigation && window.performance.navigation.type === 1) ||
    window.performance
      .getEntriesByType('navigation')
      .map((nav) => nav.type)
      .includes('reload')
);

if(pageAccessedByReload){
  var randomNumber1 = Math.floor(Math.random() * 6) + 1;
  console.log("Dice 1 is " + randomNumber1);
  document.querySelector(".img1").setAttribute("src", "images/dice" + randomNumber1 + ".png");

  var randomNumber2 = Math.floor(Math.random() * 6) + 1;
  console.log("Dice 2 is " + randomNumber2);
  document.querySelector(".img2").setAttribute("src", "images/dice" + randomNumber2 + ".png");

  if(randomNumber1 > randomNumber2){
    document.querySelector("h1").textContent = "🚩Player 1 Wins!";
  }
  else if(randomNumber1 < randomNumber2){
    document.querySelector("h1").textContent = "Player 2 Wins!🚩";
  }
  else{
    document.querySelector("h1").textContent = "Draw!";
  }
}
else{
  for(var i = 0; i < document.getElementsByTagName("img").length; i++){
    document.getElementsByTagName("img")[i].setAttribute("src", "images/dice6.png");
  }
}
