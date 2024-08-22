// Constantes block

const startBtn = document.querySelector(".start-btn");
const color = document.querySelector(".color");
const colorSelector = document.querySelector("#color-selector");
const soundIcon = document.querySelector(".sound");
const optionsElements = document.querySelectorAll('[type="number"]')

const colors = ["red", "green", "blue", "yellow"];
const MILLISEC_IN_SEC = 1000;
const rings = new Audio("./sounds/red.wav");

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
let maxColors = +colorSelector.value;
let _nextTick; // ID for next exersice setTimeout

// Conditions befor start

// console.log(options.exerciseDuration, options.exerciseTimeout, options.minExercise, options.maxExercise );


// console.log(`MIN ${options.exerciseTimeout / MILLISEC_IN_SEC} sec, MAX ${maxTimerDurationForOneSignal / MILLISEC_IN_SEC} sec, The Number of action is: ${numberOfActions}`);

// Event listeners block
colorSelector.addEventListener("change", () => {
  maxColors = +colorSelector.value;
})

startBtn.addEventListener("click", () => {
  if(isWork){
    stopExersice();
    return;
  }
  buttonTaggler()
  startExercise();
});

soundIcon.addEventListener("click", () => {
  isSoundOn = !isSoundOn;
  if (isSoundOn) {
    soundIcon.style.backgroundImage = "url(./icons/audio.svg)";
  } else {
    soundIcon.style.backgroundImage = "url(./icons/noaudio.svg)";
  }
})

optionsElements.forEach((element) => {
  element.addEventListener('change', () => {
    if(element.value < 0) {element.value = 0}
    if(element.id === "exerciseDuration" || element.id === "exerciseTimeout") {options[element.id] = (+element.value * MILLISEC_IN_SEC)}
    else {
      options[element.id] = +element.value;
    }

    // console.log(options.exerciseDuration, options.exerciseTimeout, options.minExercise, options.maxExercise );
  })
})

// Functions block

function getRandom (min = 1, max = 1){
  return Math.floor((Math.random() * (max-min) + min));
}

// Start exercise block

async function startExercise(){ 
  // console.log("The exercise started".toUpperCase());
  setTimeout(async () => {  
    stopExersice()
  }, options.exerciseDuration );
  for (let i=0; i <= numberOfActions - 1; i++) {
    const color = await startTimerForNextSignal(getColor()); //name of color
    if (i <= numberOfActions -1 && maxColors >=5 ) {
      makeDouble(color, i)
    } else if (i <= numberOfActions -1 && maxColors <= 4 ) {
      makeSimple(color, i)
    }
  };
};

function startTimerForNextSignal(color) { // color is string
  const timeoutTime = getRandom(options.exerciseTimeout, maxTimerDurationForOneSignal)
  // console.log("Next action in: " + Math.floor(timeoutTime / MILLISEC_IN_SEC) + " Sec");
  return new Promise((resolve) => {
      _nextTick = setTimeout(() => {
        resolve(color); 
      }, timeoutTime);
  })
};

function makeSimple(color, i) {
  if (isSoundOn){
    playRing(color);
  }
  setColor(color);
  // console.log(i + 1, color) ;
  setTimeout(() => { setColor("white")}, 500);
}

function makeDouble(color, i) {
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
    // console.log(i + 1, color) ;
  },500)
  setTimeout(() => { setColor("white")}, 800);
}


function getColor() {
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
}

function playRing(url) {
  rings.src = `./sounds/${url}.wav`;
  rings.play(); 
}

// Stop exercise block

function stopExersice () {
  // console.log("The exercise ended".toUpperCase());
  clearTimeout(_nextTick);
  setColor("white");
  buttonTaggler();
  numberOfActions = getRandom(options.minExercise, options.maxExercise)
  maxTimerDurationForOneSignal = options.exerciseDuration/numberOfActions;
  // console.log(`Next number of exersices ${numberOfActions}`);
  arrTimerTime = [];
}

// "Start" button condition taggler block

function buttonTaggler() {
  isWork = !isWork
  isWork ? startBtn.style.backgroundColor = "red" : startBtn.style.backgroundColor = "green"
  isWork ? startBtn.innerText = "Stop" : startBtn.innerText = "Start"
}