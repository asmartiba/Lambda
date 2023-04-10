const quoteElement = document.querySelector("#quote");
const imageElements = document.querySelectorAll("img");
const scoreElement = document.querySelector("#score");
const resetButton = document.querySelector("#reset-button");

const MAX_TRIES = 10;
const NUM_IMAGES = 6;

let chosenImages = [];
let score = 0;
let numTries = 0;

const quotes = [
  {
    text: "All we have to decide is what to do with the time that is given us.",
    author: "Gandalf"
  },
  {
    text: "Fly, you fools!",
    author: "Gandalf"
  },
  {
    text: "Not all those who wander are lost.",
    author: "Bilbo Baggins"
  }
];

const images = [
  "https://via.placeholder.com/150x150?text=1",
  "https://via.placeholder.com/150x150?text=2",
  "https://via.placeholder.com/150x150?text=3",
  "https://via.placeholder.com/150x150?text=4",
  "https://via.placeholder.com/150x150?text=5",
  "https://via.placeholder.com/150x150?text=6"
];

function getRandomQuotes() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteElement.textContent = `"${randomQuote.text}"`;
  const correctImageIndices = getRandomIndices(NUM_IMAGES, 2);
  for (let i = 0; i < imageElements.length; i++) {
    const imageIndex = i + 1;
    imageElements[i].src = images[i];
    if (correctImageIndices.includes(imageIndex)) {
      imageElements[i].setAttribute("data-correct", true);
    } else {
      imageElements[i].removeAttribute("data-correct");
    }
    imageElements[i].addEventListener("click", handleImageClick);
  }
}

function getRandomIndices(max, numIndices) {
  const indices = [];
  while (indices.length < numIndices) {
    const randomIndex = Math.floor(Math.random() * max) + 1;
    if (!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
    /*if (quotes.text == [0]) {
      indices.push(6);
      indices.push(1);
    }*/
    
  }
  return indices;
}

function handleImageClick() {
  if (chosenImages.length < 2) {
    const image = this.src;
    chosenImages.push(image);
    this.removeEventListener("click", handleImageClick);
    if (this.hasAttribute("data-correct")) {
      score += 0.5;
      this.style.border = "3px solid green";
    } else {
      this.style.border = "3px solid red";
    }
  }
  if (chosenImages.length === 2) {
    disableAllImages();
    scoreElement.textContent = `Score: ${score}`;
    numTries++;
    if (numTries === MAX_TRIES) {
      resetButton.disabled = true;
    }
    if (numTries < MAX_TRIES) {
      setTimeout(resetGame, 1500);
    }
  }
}

function disableAllImages() {
  for (let i = 0; i < imageElements.length; i++) {
    imageElements[i].removeEventListener("click", handleImageClick);
  }
}

function resetGame() {
  chosenImages = [];
  score = 0;
  scoreElement.textContent = `Score: ${score}`;
  for (let i = 0; i < imageElements.length; i++) {
    imageElements[i].style
    imageElements[i].style.border = "";
}
getRandomQuotes();
}

function resetAll() {
  chosenImages = [];
  numTries = 0;
  if (numTries === 10) {
    score = 0;
  }
 
  resetButton.disabled = false;
  scoreElement.textContent = `Score: ${score}`;
  for (let i = 0; i < imageElements.length; i++) {
    imageElements[i].style.border = "";
    imageElements[i].addEventListener("click", handleImageClick);
  }
  getRandomQuotes();
}

getRandomQuotes();
resetButton.addEventListener("click", resetAll);

function showDiv() {
  document.getElementById('Start').style.display = "block";
}
