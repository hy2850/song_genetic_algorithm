let target;
let population;

let targetHTML;
let popsize = 200, mutation_rate = 0.01;
let inp1, button1, inp2, button2;

let isLoopRunning = false;
let generation = 0;

function setup() {
  noLoop();

  let span1 = createSpan('Enter population size ');
  span1.position(20, 50);
  inp1 = createInput();
  inp1.position(span1.x + span1.width + 10, span1.y);
  // button1 = createButton('submit');
  // button1.position(inp1.x + inp1.width, inp1.y);
  // button1.mousePressed(()=>console.log("popsize"));

  let span2 = createSpan('Enter mutation rate ');
  span2.position(span1.x, span1.y + span1.height);
  inp2 = createInput();
  inp2.position(inp1.x, inp1.y + inp1.height)
  // button2 = createButton('submit2');
  // button2.position(inp2.x + inp2.width, inp2.y);
  // button2.mousePressed(()=>console.log("mutation_rate"));

  let startButton = createButton('start');
  startButton.position(span1.x)
  startButton.mousePressed(()=>{
    if(isLoopRunning){
      startButton.html("run");
      isLoopRunning = false;
      noLoop();
    }
    else{
      startButton.html("pause");
      isLoopRunning = true;

      if(inp1.value()) popsize = inp1.value();
      if(inp2.value()) mutation_rate = inp2.value();

      loop(); 
    } 
  });


  bestPhrase = createP("Best phrase:");
  //bestPhrase.position(10,10);
  bestPhrase.class("best");

  // allPhrases = createP("All phrases:");
  // allPhrases.position(600, 10);
  // allPhrases.class("all");

  stats = createP("Stats");
  //stats.position(10,200);
  stats.class("stats");

  //createCanvas(640, 360);
  //target = [16, 24, 2, 10, 11, 25, 36, 21, 27, 20, 6, 34, 2, 22, 14, 20, 3, 33, 28, 2, 16, 29, 36, 5, 2, 15, 22, 2, 13, 33]; // C3 D4 E4 F4 G4 A4 B4 Octav
  target = [10, 15, 20, 5, 7]; // C3 D4 E4 F4 G4 A4 B4 Octav

  targetHTML = createP("Target:");
  targetHTML.class("target");

  // Init population
  population = new Population();
}

function draw() {
  population.calPopulationFitness();

  population.selectParents();

  population.produceOffspring();

  population.formNextGeneration();

  population.findBest();

  generation++;

  viewUpdate();

  // // Stopping condition
  // if (population.isFinished()) {
  //   //println(millis()/1000.0);
  //   noLoop();
  // }
}

function viewUpdate() {
  // Display current status of population
  let answer = population.bestSong;
  bestPhrase.html("Best phrase:<br>" + answer.notes);

  targetHTML.html(target);

  let statstext =
    "total generations:     " + generation + "<br>";
  statstext +=
    "average fitness:       " + nf(population.getAverageFitness()) + "<br>";
  statstext += "total population:      " + popsize + "<br>";
  statstext += "mutation rate:         " + floor(mutation_rate * 100) + "%";

  stats.html(statstext);
}
