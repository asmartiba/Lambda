
var usedQuotes = [];
var questions = [];

var TijdelijkInput = {
  "quotes": [
      {"quote": "You shall not pass!", "character": "Gandalf", "movie": "The Fellowship of the Ring"},
      {"quote": "My precious.", "character": "Gollum", "movie": "The Two Towers"},
      {"quote": "All we have to decide is what to do with the time that is given us.", "character": "Gandalf", "movie": "The Fellowship of the Ring"},
      {"quote": "Not all those who wander are lost.", "character": "Bilbo Baggins", "movie": "The Fellowship of the Ring"},
      {"quote": "Even the smallest person can change the course of history.", "character": "Galadriel", "movie": "The Fellowship of the Ring"},
      {"quote": "I am no man.", "character": "Eowyn", "movie": "The Return of the King"},
      {"quote": "A wizard is never late, Frodo Baggins. Nor is he early. He arrives precisely when he means to.", "character": "Gandalf", "movie": "The Fellowship of the Ring"},
      {"quote": "Fly, you fools!", "character": "Gandalf", "movie": "The Fellowship of the Ring"},
      {"quote": "The board is set, the pieces are moving. We come to it at last, the great battle of our time.", "character": "Gandalf", "movie": "The Return of the King"},
      {"quote": "I cannot carry it for you, but I can carry you!", "character": "Samwise Gamgee", "movie": "The Return of the King"}
  ]
};
var quote = ["You shall not pass!","My precious.","All we have to decide is what to do with the time that is given us.","Fly, you fools!","The board is set, the pieces are moving. We come to it at last, the great battle of our time."]


var score = 0;
var highScore = 0;
var VraagTeller = 0;
var AantalCorrecte = 0;


function RandomQuote() {
  var randomIndex = Math.floor(Math.random() * TijdelijkInput.quotes.length);
  var quote = TijdelijkInput.quotes[randomIndex].quote;
  var character = TijdelijkInput.quotes[randomIndex].character;
  var movie = TijdelijkInput.quotes[randomIndex].movie;
  return { quote: quote, character: character, movie: movie };
}
console.log(RandomQuote());

function Options(quote) {
  var options = [{ character: quote.character, movie: quote.movie }];
  while (options.length < 3) {
      var randomQuote = RandomQuote();
      var randomOption = { character: randomQuote.character, movie: randomQuote.movie };
      if (!options.some(option => option.character === randomOption.character && option.movie === randomOption.movie)) {
          options.push(randomOption);
      }
  }
  return Schudden(options);
}


function Schudden(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}

function startQuiz() {
  document.getElementById("quote").innerHTML = "";
  document.getElementById("options").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("score").innerHTML = "";
  usedQuotes = [];
  questions = [];
  score = 0;
  questionCount = 0;
  consecutiveCorrectAnswers = 0;
  document.getElementById("start-quiz").disabled = true;
  document.getElementById("submit-answer").disabled = false;
  document.getElementById("end-quiz").disabled = false;
  generateQuestion();
}

function correct(){
  var Gandolf = document.getElementById("Gandolf");
  var Gollum = document.getElementById("Gollum");
  var frodo = document.getElementById("frodo");
  var Fellowship = document.getElementById("Fellowship");
  var Return = document.getElementById("Return");
  var Towers = document.getElementById("Towers");

  if (quote[0] =Gandolf) {
    score + 0.5;
    document.getElementById("score").innerHTML = score;
  }
  if (quote[0]=Fellowship ) {
    score +0.5;
    document.getElementById("score").innerHTML = score;
  }
  if (quote[1]= Gollum ) {
    score +0.5;
    document.getElementById("score").innerHTML = score;
  }
  if (quote[1]= Towers) {
    score +0.5;
    document.getElementById("score").innerHTML = score;
  }
  if (quote[2]=Gandolf ) {
    score +0.5;
    document.getElementById("score").innerHTML = score;
  }
  if (quote[2]= Fellowship ) {
    score +0.5;
    document.getElementById("score").innerHTML = score;
  }
  if (quote[3]=Gandolf ) {
    score +0.5;
    document.getElementById("score").innerHTML = score;
  }
  if (quote[3]=Fellowship ) {
    score +0.5;
    document.getElementById("score").innerHTML = score;
  }
  if (quote[4]= Gandolf ) {
    score +0.5;
    document.getElementById("score").innerHTML = score;
  }
  if (quote[4]= Return) {
    score +0.5;
    document.getElementById("score").innerHTML = score;
  }
}

function showDiv() {
    document.getElementById('Start').style.display = "block";
  }