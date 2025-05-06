// Constantes block

const startBtn = document.querySelector(".start-btn");

const color = document.querySelector(".color");

const progressBarElement = document.querySelector(".progress-bar");

const colorSelector = document.querySelector(".select-area");
const select = document.querySelector(".select_indicator");
const selectArea = document.querySelector(".select-opions-area");
const selectOptions = document.querySelectorAll(".option");

const soundIcon = document.querySelector(".sound");

const optionsElements = document.querySelectorAll('[type="number"]');
const optionsBtn = document.querySelector(".options");
const optionsList = document.querySelector(".options-list");

const countdownEl = document.querySelector(".countdown");
const instructionBtn = document.querySelector(".questmark");
const instruction = document.querySelector(".instruction");

const SOUNDS_PATH = 'https://github.com/GeoParf/fencingmachine/raw/master/src/assets/sounds/';

const colors = ["red", "green", "blue", "yellow"];
const MILLISEC_IN_SEC = 1000;
const rings = new Audio(`${SOUNDS_PATH}red.wav`);

const options = {
  "exerciseDuration" : +optionsElements[0].value * MILLISEC_IN_SEC,
  "minimumSignalTimeout" : +optionsElements[1].value * MILLISEC_IN_SEC,
  "maximumSignalTimeout" : +optionsElements[2].value * MILLISEC_IN_SEC,
};

// Variables block

let nextTick = 0;

let isWork = false;
let isSoundOn = true;
let isOptionVisible = false;
let isSelectVisible = false;
let isInstructionVisible = false;
let maxColors = 1;
let _counterID; // ID for counter setInterval
let _nextTickID; // ID for next exersice setTimeout
let _startDelayID; // ID for delay for countdaun befor start setTimeout
let _stopExerciseId; // ID for stop exersice setTimeout
let _progressInterval // ID for Progress bar setInterval

// Event listeners block

colorSelector.addEventListener("click", () => {
    isSelectVisible = !isSelectVisible;
    isSelectVisible ? selectArea.style.visibility = "visible" : selectArea.style.visibility = "hidden";  
});

selectOptions.forEach(el => {
  el.addEventListener("click", () => {
    maxColors = +el.attributes.value.value;
    select.innerText = el.innerText;
  });
});

optionsBtn.addEventListener("click", () => {  
  optionTaggler()
  if(isInstructionVisible) instructionTaggler()
});

instructionBtn.addEventListener("click", () => {
  instructionTaggler()
  if(isOptionVisible) optionTaggler()
});

startBtn.addEventListener("click", async () => {

  optionsList.style.visibility = "hidden";
  optionsBtn.style.backgroundImage  = "url(./src/assets/icons/settings.png)";

  playRing("click");
  if(isWork){
    stopExersice();
    return;
  }
  startButtonTaggler();
  await countdown();
  _startDelayID = setTimeout(() => {
    startExercise();
  }, 4000);
});

soundIcon.addEventListener("click", () => {
  isSoundOn = !isSoundOn;
  if (isSoundOn) {
    soundIcon.style.backgroundImage = "url(./src/assets/icons/audio.svg)";
  } else {
    soundIcon.style.backgroundImage = "url(./src/assets/icons/noaudio.svg)";
  }
});

optionsElements.forEach((element) => {
  element.addEventListener('change', () => {
    if(element.value < 0) {element.value = 0};
    if(element.id === "exerciseDuration" || element.id === "minimumSignalTimeout") {
      options[element.id] = (+element.value * MILLISEC_IN_SEC);
    }
    else {
      options[element.id] = +element.value;
    }
  })
});

// Functions block

function getRandom (min = 1, max = 5){
  return Math.floor((Math.random() * (max-min) + min));
};

function updateProgressBarBySignals(totalSignals, completedSignals) {
  const progress = (completedSignals / totalSignals) * 100;
  progressBarElement.style.width = `${Math.min(progress, 100)}%`;
};


// Tagglers block

function optionTaggler(){
  isOptionVisible = !isOptionVisible;
    if(isOptionVisible){
      optionsList.style.visibility = "visible";
      optionsBtn.style.backgroundImage = "url(./src/assets/icons/close.png)" ;
    } else {
      optionsList.style.visibility = "hidden";
      optionsBtn.style.backgroundImage  = "url(./src/assets/icons/settings.png)";
  }
};

function instructionTaggler(){
  isInstructionVisible = !isInstructionVisible;
  if(isInstructionVisible ){
    instruction.style.visibility = "visible";
    instructionBtn.style.backgroundImage = "url(./src/assets/icons/close.png)";
  } else {
    instruction.style.visibility = "hidden";
    instructionBtn.style.backgroundImage = "url(./src/assets/icons/question-mark-icon.png)";
  }
};

function startButtonTaggler() {
  isWork = !isWork;
  isWork ? startBtn.style.backgroundColor = "red" : startBtn.style.backgroundColor = "green";
  isWork ? startBtn.innerText = "Stop" : startBtn.innerText = "Start";
};

// Exercise condition block

async function countdown () {
  let counter = 5;
  _counterID = setInterval(()=> {
    counter--;
    countdownEl.innerText = counter - 1;
    if (counter === 1) countdownEl.innerText = "GO";
    if (counter === 0) {
      playRing("red");
      clearInterval(_counterID);
      countdownEl.innerText = "";
      return;
    }
  }, MILLISEC_IN_SEC);
};

function makeSimple(color) {
  playRing(color);
  
  setTimeout(() => { setColor(color);}, 150);
  setTimeout(() => { setColor("white")}, 650);
};

function makeDouble(color) {
  setColor("red");
  playRing("red");

  setTimeout(() => { setColor("white")}, 200)
  setTimeout(async () => {
    playRing(color);
    setColor(color);
  },700)
  setTimeout(() => { setColor("white")}, 1300);
};

// Color menagment block

function getColor() { // returns string name of color
  if (maxColors <= 4) {
    const numberOfSignal = getRandom(0, maxColors);
    return colors[numberOfSignal];
  } else {
    const numberOfSignal = getRandom(1, (maxColors - 3));
    return colors[numberOfSignal];
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
};

// Sound managment block

function playRing(nameOfColorString) { 
  if(isSoundOn) {
    rings.src = `${SOUNDS_PATH}${nameOfColorString}.wav`; 
    rings.play();  
  }
};

// Stop exercise function

function stopExersice () {
  nextTick = 0;
  clearInterval(_progressInterval);
  clearInterval(_counterID);
  countdownEl.innerText = "";
  clearTimeout(_nextTickID);
  clearTimeout(_startDelayID);
  clearTimeout(_stopExerciseId);
  setColor("white");
  startButtonTaggler();
  playRing("red");
  progressBarElement.style.width = `0%`;
};

// Start exercise function

async function startExercise() {

  nextTick = Math.round(getRandom(options.minimumSignalTimeout, options.maximumSignalTimeout) / MILLISEC_IN_SEC);

  _stopExerciseId = setTimeout(() => { stopExersice() }, options.exerciseDuration);

  const startTime = Date.now();

  const formatedMinimumSignalTimeout = Math.round(options.minimumSignalTimeout / MILLISEC_IN_SEC)

  _progressInterval = setInterval(async() => {
    
    const elapsedTime = Date.now() - startTime;
    const formatedElapsedTime = Math.round((elapsedTime)/ MILLISEC_IN_SEC)
    
    updateProgressBarBySignals(options.exerciseDuration, elapsedTime);
  
    if(nextTick === formatedElapsedTime) {
      const color = getColor();
      nextTick = getRandom(formatedElapsedTime + formatedMinimumSignalTimeout, formatedElapsedTime + options.maximumSignalTimeout / MILLISEC_IN_SEC);
     
      if (maxColors >= 5) {
        makeDouble(color);
      } else if (maxColors <= 4) {
        makeSimple(color);
      }
    }
    
    if (elapsedTime >= options.exerciseDuration) clearInterval(_progressInterval);
 
  }, MILLISEC_IN_SEC); // Update progress every 1000ms
}
