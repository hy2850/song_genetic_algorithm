// Core variables for the main program
let target, targetLen;
let population;
let isLoopRunning = false;

// UI
let generation = 0;
let musicSheet;
let img;

// Hyperparameters
let popsize = 200, mutation_rate = 0.01;

// Adjustable constants for Sheet
const beatsPerSheet = 10;

function setup() {
  noLoop();

  textInit(20, 20);

  target = [16, 24, 2, 10, 11, 25, 36, 21, 27, 20, 6, 34, 2, 22, 14, 20, 3, 33, 28, 2, 16, 29, 36, 5, 2, 15, 22, 2, 13, 33]; // C3 D4 E4 F4 G4 A4 B4 Octav
  //target = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // C3 D4 E4 F4 G4 A4 B4 Octav
  targetLen = target.length;

  // Init population
  population = new Population();

  // UI for music notes
  const sheetX = 100, sheetY = 180, sheetH = 8*h;
  let canvas = createCanvas(linelen * (beatsPerSheet+1), sheetH * (ceil(targetLen/beatsPerSheet) + 1));
  canvas.parent('sketch-holder');

  musicSheet = new Sheet(sheetX, sheetY, sheetH);
}

function draw() {
  population.calPopulationFitness();

  //population.selectParents.roulette.call(population);
  population.selectParents.tournament.call(population, popsize/2);

  population.produceOffspring();

  population.formNextGeneration();

  population.findBest();

  generation++;

  textUpdate();
  sheetUpdate();

  // Stopping condition
  if (isArrEqual(target, bestSong.notes)) {
    isLoopRunning = false;
    noLoop();
  }
}

function isArrEqual(arr1, arr2){
  if(arr1.length != arr2.length) return false;
  return arr1.every((elem, idx)=>elem === arr2[idx]);
}