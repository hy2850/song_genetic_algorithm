// Core variables for the main program
let target, targetLen;
let population;
let isLoopRunning = false;
let minFitness = false; // true if optimize happens to minimize the fitness

// UI
let generation = 0;
let musicSheet;
let img;

// Hyperparameters
let popsize = 200, mutation_rate = 0.01;
let fitnessChoice = 0;
let parentSelectionChoice = 0;
let crossoverChoice = 0;
let mutationChoice = 0;
let generationSelectionChoice = 0;

// Adjustable constants for Sheet
const beatsPerSheet = 10;

function setup() {
  noLoop();

  target = [16, 24, 2, 10, 11, 25, 36, 21, 27, 20, 6, 34, 2, 22, 14, 20, 3, 33, 28, 2, 16, 29, 36, 5, 2, 15, 22, 2, 13, 33]; // C3 D4 E4 F4 G4 A4 B4 Octav
  //target = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // C3 D4 E4 F4 G4 A4 B4 Octav
  targetLen = target.length;

  hypeUI = textInit(20, 20); // hyperparameter input UI

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

        // Set hyperparameters
        if (generation <= 1){
          if(hypeUI.popSizeInp.value()) popsize = parseInt(popSizeInp.value(), 10);
          if(hypeUI.mutRateInp.value()) mutation_rate = parseFloat(mutRateInp.value());
          
          fitnessChoice = document.querySelector('#fitSel').selectedIndex;
          parentSelectionChoice = document.querySelector('#selSel').selectedIndex;
          crossoverChoice = document.querySelector('#crossSel').selectedIndex;
          mutationChoice = document.querySelector('#mutSel').selectedIndex;
          generationSelectionChoice = document.querySelector('#genSel').selectedIndex;
          
          if(fitnessChoice > 0)
            minFitness = true;

          //console.log(fitnessChoice, selectionChoice, crossoverChoice, mutationChoice, generationSelectionChoice);

          // Init population
          population = new Population();
        }
        loop(); 
    } 
  });
  population = new Population(); // dummy for initial UI rendering

  // UI for music notes
  const sheetX = 100, sheetY = 180, sheetH = 8*h;
  let canvas = createCanvas(linelen * (beatsPerSheet+1), sheetH * (ceil(targetLen/beatsPerSheet) + 1));
  canvas.parent('sketch-holder');

  musicSheet = new Sheet(sheetX, sheetY, sheetH);
}

// Evolutionary cycle
function draw() {
  population.calPopulationFitness();

  switch(parentSelectionChoice) {
    case 0:
      // select by roulette + FPS
      population.selectParents.roulette.call(population);
      break;
    case 1:
      // select by tournament (slow)
      population.selectParents.tournament.call(population, popsize/2);
  }

  population.produceOffspring();

  switch(generationSelectionChoice) {
    case 0:
      // total replacement
      population.formNextGeneration.gradual_replacement.call(population, popsize);
      break;
    case 1:
      // gradual replacement
      population.formNextGeneration.gradual_replacement.call(population, floor(popsize/2));
      break;
    case 2:
      // elitism
      population.formNextGeneration.elitism.call(population, floor(popsize/20));
  }
  
  population.findBest();

  generation++;

  textUpdate();
  sheetUpdate();

  // Stopping condition
  if (isArrEqual(target, bestSong.notes)) {
    isLoopRunning = false;
    noLoop();
    alert('Simulation over - reload page to try again');
  }

  // Slow mode - stops at every generation
  //document.getElementById("start").click(); 
}

function isArrEqual(arr1, arr2){
  if(arr1.length != arr2.length) return false;
  return arr1.every((elem, idx)=>elem === arr2[idx]);
}