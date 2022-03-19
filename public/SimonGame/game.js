//Initialize variables.
var buttonColors = ["green", "red", "yellow", "blue"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var gameOn = false;
var answerSuccess = true;

//Determine the next color in the game sequence.
function nextSequence(){

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColors[randomNumber];
  userClickedPattern = [];

  gamePattern.push(randomChosenColor);

  playSound(randomChosenColor);
  $("#" + randomChosenColor).fadeOut(100).fadeIn(100);

  level++;
  $("h1").text("Level " + level);

}

//Detect button clicks and store the ID of the clicked button.
$(".btn").click(function(event){

  var userChosenColor = event.currentTarget.id;
  userClickedPattern.push(userChosenColor);
  animatePress(userChosenColor);
  playSound(userChosenColor);
  checkAnswer(userClickedPattern.length - 1);

  if (answerSuccess && userClickedPattern.length === gamePattern.length){
    setTimeout(function(){nextSequence();}, 1000);
  }

});

//Animate buttons clicked by user.
function animatePress(currentColor){
  $("#" + currentColor).toggleClass("pressed");
  setTimeout(function(){$("#" + currentColor).toggleClass("pressed");}, 100);
}

//Handle playing the correct sound based on button color.
function playSound(buttonColor){

  switch(buttonColor){
    case "green":
      var greenSound = new Audio("sounds/green.mp3");
      greenSound.play();
      break;
    case "red":
      var redSound = new Audio("sounds/red.mp3");
      redSound.play();
      break;
    case "yellow":
      var yellowSound = new Audio("sounds/yellow.mp3");
      yellowSound.play();
      break;
    case "blue":
      var blueSound = new Audio("sounds/blue.mp3");
      blueSound.play();
      break;
    default:
      var wrong = new Audio("sounds/wrong.mp3");
      wrong.play();
      break;
  }

}

//Detect keydown event to start game.
$(document).keypress(function(event){

  if(gameOn){
    return;
  }
  else{
    gameOn = true;
    nextSequence();
  }

})

//Check user's answer against game pattern.
function checkAnswer(index){

  if (userClickedPattern[index] === gamePattern[index]){
    answerSuccess = true;
  }
  else if (userClickedPattern[index] !== gamePattern[index]){
    answerSuccess = false;
    playSound();
    $("body").addClass("game-over");
    setTimeout(function(){$("body").removeClass("game-over")}, 200);
    $("h1").text("Game Over, press any key to restart");
    startOver();
  }
  else {
    console.log("something is messed up, somehow")
  }

}

//Restart the game if user provides wrong answer.
function startOver(){
  gameOn = false;
  level = 0;
  gamePattern = [];
}
