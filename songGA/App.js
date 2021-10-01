preparedSongs = [
  [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0, 4, 7, 4, 0], // C Major scale
  [7, 7, 9, 9, 7, 7, 4, 36, 7, 7, 4, 4, 2], // 학교 종이 땡땡땡 
];

// Core variables for the main program
let target;
let population;
let isLoopRunning = false;
let minFitness = false; // true if optimize happens to minimize the fitness
let slowMode = false;
let bestSong;

// UI
let generation = 0;
let musicSheet;

// Hyperparameters
let popsize = 100, mutation_rate = 0.01; // default
let fitnessChoice = 0;
let parentSelectionChoice = 0;
let crossoverChoice = 0;
let mutationChoice = 0;
let generationSelectionChoice = 0;

// Other adjustable constants
const beatsPerSheet = 10;

// Initialize program (UI and variables)
function setup() {
  noLoop();

  //target = [16, 24, 2, 10, 11, 25, 36, 21, 27, 20, 6, 34, 2, 22, 14, 20, 3, 33, 28, 2, 16, 29, 36, 5, 2, 15, 22, 2, 13, 33]; // C3 D4 E4 F4 G4 A4 B4 Octav
  //target = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // C3 D4 E4 F4 G4 A4 B4 Octav
  target = preparedSongs[1];

  hypeUI = textInit(20, 20); // hyperparameter input + text UI

  // Get user input for hyperparameters
  hypeUI.startButton.mousePressed(()=>{
    if(isLoopRunning){
        hypeUI.startButton.html("resume");
        isLoopRunning = false;
        noLoop();
    }
    else{
        hypeUI.startButton.html("pause");
        isLoopRunning = true;

        // Set hyperparameters (only once in the beginning)
        if (generation <= 1){
          if(hypeUI.popSizeInp.value()) popsize = parseInt(popSizeInp.value(), 10);
          if(hypeUI.mutRateInp.value()) mutation_rate = parseFloat(mutRateInp.value());

          fitnessChoice = document.querySelector('#fitSel').selectedIndex;
          parentSelectionChoice = document.querySelector('#selSel').selectedIndex;
          crossoverChoice = document.querySelector('#crossSel').selectedIndex;
          mutationChoice = document.querySelector('#mutSel').selectedIndex;
          generationSelectionChoice = document.querySelector('#genSel').selectedIndex;
          
          slowMode = document.querySelector('.slow input[type="checkbox"]').checked;

          // Reverse optimization direction (fitness maximize -> minimize)
          if(fitnessChoice > 0)
            minFitness = true;

          // Init population
          population = new Population();
        }
        loop(); 
    } 
  });
  population = new Population(); // dummy for initial UI rendering

  // UI for music notes
  const sheetX = 100, sheetY = 180, sheetH = 8*h;
  let canvas = createCanvas(linelen * (beatsPerSheet+1), sheetH * (ceil(target.length/beatsPerSheet) + 1));
  canvas.parent('sketch-holder');

  musicSheet = new Sheet(sheetX, sheetY, sheetH);
}

// Main program loop - Evolutionary cycle
function draw() {
  // Step 1. Calculate each individual's fitness
  population.calPopulationFitness();

  // Step 2. Select parents
  switch(parentSelectionChoice) {
    case 0:
      // select by roulette
      population.selectParents.roulette.call(population);
      break;
    case 1:
      // select by tournament (slower)
      population.selectParents.tournament.call(population, popsize/2);
  }

  // Step 3. cross-over, mutation
  population.produceOffspring();

  // Step 4. Select next generation from current parent+offspring population pool
  switch(generationSelectionChoice) {
    case 0:
      // total replacement
      population.formNextGeneration.gradual_replacement.call(population, popsize);
      break;
    case 1:
      // gradual replacement (control replace size here)
      population.formNextGeneration.gradual_replacement.call(population, floor(popsize/2));
      break;
    case 2:
      // elitism (control preserve size here)
      population.formNextGeneration.elitism.call(population, floor(popsize/20));
  }
  
  // Show individual with best fitness
  population.findBest();

  generation++;

  // Update UI
  textUpdate();
  sheetUpdate();

  // Stopping condition - target song is found
  if (isArrEqual(target, bestSong.notes)) {
    isLoopRunning = false;
    noLoop();
    alert('Simulation over - reload page to try again');
  }

  // Slow mode - stops at every generation
  if(slowMode){
    hypeUI.startButton.html("resume");
    isLoopRunning = false;
    noLoop();
  }
}

function isArrEqual(arr1, arr2){
  if(arr1.length != arr2.length) return false;
  return arr1.every((elem, idx)=>elem === arr2[idx]);
}