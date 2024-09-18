//Todo поменять звуковой сигнал перед началом

// Constantes block

const startBtn = document.querySelector(".start-btn");
const color = document.querySelector(".color");
const colorSelector = document.querySelector("#color-selector");
const soundIcon = document.querySelector(".sound");
const optionsElements = document.querySelectorAll('[type="number"]')
const optionsBtn = document.querySelector(".options");
const optionsList = document.querySelector(".options-list");
const countdownEl = document.querySelector(".countdown");
//const LOCAL_SOUND = "../src/assets/sounds/";
const WEB_SOUND = "https://github.com/GeoParf/fencingmachine/raw/master/src/assets/sounds/"

const colors = ["red", "green", "blue", "yellow"];
const MILLISEC_IN_SEC = 1000;
const rings = new Audio(`${WEB_SOUND}red.wav`);

const options = {
  "exerciseDuration" : +optionsElements[0].value * MILLISEC_IN_SEC,
  "exerciseTimeout" : +optionsElements[1].value * MILLISEC_IN_SEC,
  "minExercise" : +optionsElements[2].value,
  "maxExercise" : +optionsElements[3].value,
}

// Variables block

let numberOfActions = getRandom(options.minExercise, options.maxExercise);
let maxTimerDurationForOneSignal = options.exerciseDuration/numberOfActions;

let isWork = false;
let isSoundOn = true;
let isVisible = false;
let maxColors = +colorSelector.value;
let _counterID; // ID for counter setInterval
let _nextTickID; // ID for next exersice setTimeout
let _startDelayID; // ID for delay for countdaun befor start setTimeout
let _stopExerciseId; // ID for stop exersice setTimeout

// Event listeners block
colorSelector.addEventListener("change", () => {
  maxColors = +colorSelector.value;
})

optionsBtn.addEventListener("click", (evt) => {  
  if(evt.target.classList[0]){
    if( evt.target.classList[0].includes("opt-img") || evt.target.classList[0].includes("options")){
      isVisible = !isVisible;
      isVisible ? optionsList.style.visibility = "visible" : optionsList.style.visibility = "hidden"
    }
  }
})

startBtn.addEventListener("click", () => {
  if(isWork){
    stopExersice();
    return;
  }
  buttonTaggler()
  countdown()
  _startDelayID = setTimeout(() => {
    startExercise();
  }, 4000)
});

soundIcon.addEventListener("click", () => {
  isSoundOn = !isSoundOn;
  if (isSoundOn) {
    soundIcon.style.backgroundImage = "url(./src/assets/icons/audio.svg)";
  } else {
    soundIcon.style.backgroundImage = "url(./src/assets/icons/noaudio.svg)";
  }
})

optionsElements.forEach((element) => {
  element.addEventListener('change', () => {
    if(element.value < 0) {element.value = 0}
    if(element.id === "exerciseDuration" || element.id === "exerciseTimeout") {options[element.id] = (+element.value * MILLISEC_IN_SEC)}
    else {
      options[element.id] = +element.value;
    }
  })
})

// Functions block

function getRandom (min = 1, max = 1){
  return Math.floor((Math.random() * (max-min) + min));
}

// Start exercise block
function countdown () {
  let counterText = 4
  _counterID = setInterval(()=> {
    countdownEl.innerText = --counterText
    if (counterText===0) {
      if(isSoundOn) {playRing("red")};
      clearInterval(_counterID);
      countdownEl.innerText = ""
    }
  }, 1000)
}

async function startExercise(){ 
  _stopExerciseId = setTimeout(() => {          
    stopExersice()
  }, options.exerciseDuration );
  for (let i=0; i <= numberOfActions - 1; i++) {
    const color = await startTimerForNextSignal(getColor());
    if (i <= numberOfActions -1 && maxColors >=5 ) {
      makeDouble(color, i)
    } else if (i <= numberOfActions -1 && maxColors <= 4 ) {
      makeSimple(color, i)
    }
  };
};

function startTimerForNextSignal(color) { 
  const timeoutTime = getRandom(options.exerciseTimeout, maxTimerDurationForOneSignal)
  return new Promise((resolve) => {
      _nextTickID = setTimeout(() => {
        resolve(color); 
      }, timeoutTime);
  })
};

function makeSimple(color) {
  if (isSoundOn){
    playRing(color);
  }
  
  setTimeout(() => { setColor(color);}, 150);
  setTimeout(() => { setColor("white")}, 650);
}

function makeDouble(color) {
  setColor("red");
  if (isSoundOn){
    playRing("red");
  }

  setTimeout(() => { setColor("white")}, 200)
  setTimeout(() => {
    if (isSoundOn){
      playRing(color);
    }
    setColor(color);
  },500)
  setTimeout(() => { setColor("white")}, 800);
}

function getColor() { // returns string name of color
  if (maxColors <= 4) {
    const numberOfSignal = getRandom(0, maxColors)
    return colors[numberOfSignal] 
  } else {
    const numberOfSignal = getRandom(1, (maxColors - 3))
    return colors[numberOfSignal] 
  } 
};

function setColor(colorOfSignal){
  color.style.backgroundColor = colorOfSignal;
  if(colorOfSignal === "white") {
    color.style.visibility = "hidden";
  }
  else {
    color.style.visibility = "visible";
  }
}

function playRing(filename) {
  rings.src = `${WEB_SOUND}${filename}.wav`;
  rings.play(); 
}

// Stop exercise block

function stopExersice () {
  clearInterval(_counterID);
  countdownEl.innerText = "";
  clearTimeout(_nextTickID);
  clearTimeout(_startDelayID);
  clearTimeout(_stopExerciseId);
  setColor("white");
  buttonTaggler();
  numberOfActions = getRandom(options.minExercise, options.maxExercise)
  maxTimerDurationForOneSignal = options.exerciseDuration/numberOfActions;
}

// "Start" button condition taggler block

function buttonTaggler() {
  isWork = !isWork
  isWork ? startBtn.style.backgroundColor = "red" : startBtn.style.backgroundColor = "green"
  isWork ? startBtn.innerText = "Stop" : startBtn.innerText = "Start"
}