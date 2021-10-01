const compareFitnessInc = (s1, s2) => {
  const a = s1.fitness;
  const b = s2.fitness;
  if (a < b)
    return -1;
  else if (a == b)
    return 0;
  else
    return 1;
}
const compareFitnessDec = (s1, s2) => {
  const a = s1.fitness;
  const b = s2.fitness;
  if (a < b)
    return 1;
  else if (a == b)
    return 0;
  else
    return -1;
}

class Population {
  // Private
  #fitsum

  constructor() {
    this.parentPop = []; // Main population - invariant : always sorted, best indiv on the front
    this.matingPool = [];
    this.childPop = []; // Child population for step 3 - 'produceOffspring'

    this.#fitsum = 0;

    // Init parentPop with new random individuals
    for (let i = 0; i < popsize; i++) {
      this.parentPop[i] = new Song(target);
    }
  }

  // Step 1. Calculate fitness of each individual (Song) in the population
  calPopulationFitness() {
    this.#fitsum = 0;
    for (let i = 0; i < this.parentPop.length; i++) {
      let song = this.parentPop[i];
      song.calFitness(fitnessChoice);
      this.#fitsum += song.fitness;
    }

    // parentPop Invariant
    if (minFitness) this.parentPop.sort(compareFitnessDec);
    else this.parentPop.sort(compareFitnessInc);
  }

  // Step 2. Select parents to form mating pool
  selectParents = {
    roulette: function () {
      // Roulette + FPS
      let cumProb = []; // cumulative probability, proportional to fitness
      let p = mapFitnessToProb(this.parentPop[0].fitness, this.#fitsum);
      cumProb[0] = p;
      for (let i = 1; i < popsize; i++) {
        p = mapFitnessToProb(this.parentPop[i].fitness, this.#fitsum);
        cumProb[i] = cumProb[i - 1] + p;
      }

      this.matingPool = []
      for (let i = 0; i < popsize; i++) {
        let rand = random();
        let j = 0;
        while (cumProb[j] < rand) {
          j++;
        }
        this.matingPool[i] = this.parentPop[j];
      }
    },
    tournament: function (K) {
      // tournament - select best among randomly chosen K
      for (let i = 0; i < popsize; i++) {
        let tmp = []
        for (let j = 0; j < K; j++) {
          tmp.push(random(this.parentPop));
        }

        this.matingPool[i] = tmp.reduce((prev, cur) => {
          if (minFitness)
            return prev.fitness < cur.fitness ? prev : cur;
          else
            return prev.fitness < cur.fitness ? cur : prev;
        })
      }
    }
  }

  // Step 3. Produce offspring population - crossover and mutation
  produceOffspring() {
    this.childPop = [];

    for (let i = 0; i < this.parentPop.length; i++) {
      let parent1 = random(this.matingPool);
      let parent2 = random(this.matingPool);
      let child;

      switch (crossoverChoice) {
        case 0:
          child = crossover.singlePoint(parent1, parent2);
          break;
        case 1:
          child = crossover.uniform(parent1, parent2);
          break;
        case 2:
          child = crossover.average(parent1, parent2);
      }

      switch (mutationChoice) {
        case 0:
          mutation.randomFlip(child);
          break;
        case 1:
          mutation.addVal(child);
      }

      child.calFitness(fitnessChoice);
      this.childPop[i] = child;
    }
  }

  // Step 4. With parent and offspring population, get next generation population
  formNextGeneration = {
    // Gradual replacement
    // if replaceCnt == this.parentPop.length, whole parent population will be replaced with offspring population
    gradual_replacement: function (replaceCnt = this.parentPop.length) {
      if (minFitness) this.childPop.sort(compareFitnessInc);
      else this.childPop.sort(compareFitnessDec);

      // Replace 'replaceCnt' individuals with lowest fitness from parent with same amount of best offsprings
      for (let i = 0; i < replaceCnt; i++) {
        this.parentPop[i] = this.childPop[i];
      }
    },

    // Elitism
    // Keep 'keepCnt' best individuals from the parent population
    elitism: function (keepCnt) {
      const N = this.parentPop.length;
      for (let i = keepCnt; i < N; i++) {
        this.parentPop[i] = random(this.childPop); // randomly select offspring for the rest of the population
      }
    }
  }

  // Find individual with best fitness
  findBest() {
    if (minFitness) this.parentPop.sort(compareFitnessInc);
    else this.parentPop.sort(compareFitnessDec);
    bestSong = this.parentPop[0];
  }

  // Calculate average fitness of the whole population
  getAverageFitness() {
    return this.#fitsum / popsize;
  }
}

// Used in roulette selection
function mapFitnessToProb(fit, fitsum) {
  return map(fit, 0, fitsum, 0, 1)
}