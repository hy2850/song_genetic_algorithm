const REST = 36;
const INF = 1e9;
const NOTE = 0;
const SPD = 1;

class Song {
  constructor() {
    this.N = target.length;
    this.fitness = 0;
    this.notes = []; 

    // Init current song with random notes
    for (let i = 0; i < this.N; i++) {
      this.notes[i] = newNote();
    }
  }

  // Fitness calculation method
  // Count matching notes (also with same spd)
  correctCount(){
    let match = 0;
    for (let i = 0; i < this.N; i++) {
      if (this.notes[i][SPD] == target[i][SPD] && this.notes[i][NOTE] == target[i][NOTE]) {
        match++;
      }
    }
    // this.fitness = match / target.length;
    this.fitness = pow(match / target.length, 2); // emphasize the correct count
  }

  distanceAbs(){
    let dist = 0;
    for (let i = 0; i < this.N; i++) {
      dist += abs(target[i][NOTE] - this.notes[i][NOTE]) + (this.notes[i][SPD] != target[i][SPD] ? 40 : 0);
    }
    this.fitness = dist;
  }

  distanceRMSE(){
    let dist = 0;
    for (let i = 0; i < this.N; i++) {
      dist += sq((target[i][NOTE] - this.notes[i][NOTE]) + (this.notes[i][SPD] != target[i][SPD] ? 40 : 0));
    }
    this.fitness = sqrt(dist / this.N)
  }

  calFitness(choice=0){
    switch(choice){
      case 0:
        this.correctCount();
        break;  
      case 1:
        this.distanceAbs();
        break;
      case 2:
        this.distanceRMSE();
    }
  }
}

// Create new note
// 0~35 : note (C3~B5) for 3 octaves
// 36 : rest
// 37 : continue previous note (testing)
function newNote() {
  return [floor(random(0,37)), floor(random(0,2))];
}

// Crossover options
crossover = {
  // Choose a single mid-point to twist and mix
  singlePoint : function(song1, song2) {
    // A new child
    const N = song1.notes.length;
    let offspring = new Song(N);

    // Single-point cross-over
    // song1[0...idx-1] + song2[idx...N]
    let idx = floor(random(N)); // cut point
    offspring.notes = Object.assign([], song1.notes);
    offspring.notes.splice(idx, offspring.notes.length-idx, ...song2.notes.slice(idx));
    return offspring;
  },
  // At each point, choose to mix each gene or not
  uniform : function(song1, song2){
    const N = song1.notes.length;
    let offspring = new Song(N);

    for (let i = 0; i < N; i++) {
      if(random() < 0.5) offspring.notes[i] = song1.notes[i];
      else offspring.notes[i] = song2.notes[i];
    }
    return offspring;
  },
  // Take arithmetic average
  average : function(song1, song2){
    const N = song1.notes.length;
    let offspring = new Song(N);

    for (let i = 0; i < N; i++) {
      offspring.notes[i][NOTE] = floor((song1.notes[i][NOTE] + song2.notes[i][NOTE])/2);
      offspring.notes[i][SPD] = song1.notes[i][SPD] == song2.notes[i][SPD] ? 1 : 0;
    }
    return offspring;
  },
}

// Mutation options
mutation = {
  // Based on a mutation probability, picks a new random character
  randomFlip : function(song) {
    for (let i = 0; i < song.notes.length; i++) {
      if (random() <= mutation_rate) {
        song.notes[i] = newNote();
      }
    }
  },
  // Add +1 or -1 to each gene, based on the mutation probability
  addVal : function(song, weight = 1) {
    for (let i = 0; i < song.notes.length; i++) {
      if (random() <= mutation_rate) {
        song.notes[i][NOTE] += random([-1, 1]) * weight;
        song.notes[i][SPD] = floor(random(0, 2));
      }
    }
  }
}