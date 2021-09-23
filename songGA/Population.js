const compareFitnessInc = (s1, s2)=>{
  const a = s1.fitness;
  const b = s2.fitness;
  if(a < b)
    return -1;
  else if(a == b)
    return 0;
  else
    return 1;
}
const compareFitnessDec = (s1, s2)=>{
  const a = s1.fitness;
  const b = s2.fitness;
  if(a < b)
    return 1;
  else if(a == b)
    return 0;
  else
    return -1;
}


class Population {
  // Private
  #fitsum

  constructor() {    
    this.bestSong; 

    this.parentPop = []; // Main population
    this.matingPool = [];
    this.childPop = []; // Child population for step 3 - 'produceOffspring'


    //this.tournamentK = 2;
    this.#fitsum = 0;

    // Init parentPop with new random individuals
    for (let i = 0; i < popsize; i++) {
      this.parentPop[i] = new Song(target);
    }
    
    //this.calculateFitness();
  }

  // Step 1. Calculate fitness of each individual (Song) in the population
  calPopulationFitness() {
    this.#fitsum = 0;
    for (let i = 0; i < this.parentPop.length; i++) {
      let song = this.parentPop[i];
      song.calFitness();

      this.#fitsum += song.fitness;
    }
    this.parentPop.sort(compareFitnessInc);
  }

  // Step 2. Select parents to form mating pool
  selectParents() {
    const N = this.parentPop.length;

    // Roulette + FPS
    let cumProb = []; // cumulative probability, proportional to fitness
    let p = mapFitnessToProb(this.parentPop[0].fitness, this.#fitsum);
    cumProb[0] = p;
    for (let i = 1; i < N; i++) {
      p = mapFitnessToProb(this.parentPop[i].fitness, this.#fitsum);
      cumProb[i] = cumProb[i-1] + p;
    }

    this.matingPool = []
    for (let i = 0; i < N; i++) {
      let j = 0;
      while(cumProb[j] < random()){
        j++;
      }
      this.matingPool[i] = this.parentPop[j];
    }
  }

  // Step 3. Produce offspring population - crossover and mutation
  produceOffspring() {
    this.childPop = [];

    for (let i = 0; i < this.parentPop.length; i++) {
      let parent1 = random(this.matingPool);
      let parent2 = random(this.matingPool);

      let child = crossover.singlePoint(parent1, parent2);

      mutation.singleFlip(child);
      
      child.calFitness();
      this.childPop[i] = child;
    }
  }

  // Step 4. With parent and offspring population, get next generation population
  formNextGeneration(){
    // Gradual replacement
    let replaceCnt = this.parentPop.length; //floor(this.parentPop.length / 2);
    this.childPop.sort(compareFitnessDec);

    // Replace 'replaceCnt' individuals with lowest fitness from parent with same amount of best offsprings
    for (let i = 0; i < replaceCnt; i++) {
    //for (let i = 0; i < this.population.length; i++) {
      this.parentPop[i] = this.childPop[i];
    }
  }

  // Find individual with best fitness
  findBest() {
    this.parentPop.sort(compareFitnessDec);
    this.bestSong = this.parentPop[0];
  }

  // Calculate average fitness of the whole population
  getAverageFitness() {
    // const N = this.parentPop.length;
    // return this.parentPop.map(s=>s.fitness)
    //                      .reduce((prev, cur)=>prev+cur) / N;
    return this.#fitsum / popsize;
  }
}

function mapFitnessToProb(fit, fitsum){
  return map(fit, 0, fitsum, 0, 1)
}