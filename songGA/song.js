const REST = 37;
const INF = 1e9;
let N;

class Song {
  constructor() {
    N = target.length;
    this.fitness = 0;
    this.notes = []; 

    // Init current song with random notes
    for (let i = 0; i < N; i++) {
      this.notes[i] = newNote();
    }
  }

  // Fitness : manhattan distance between my note and the target note
  // If target note is 'rest' and my note is not, fitness is 0 (because 'rest' note is important in music)
  // @args array of numbers (representing notes and rests)
  // @return void
  calFitness() {
    let score = 0;
    for (let i = 0; i < N; i++) {
      if (this.notes[i] == target[i]) {
        score++;
      }
    }
    // this.fitness = score / target.length;
    this.fitness = pow(score / target.length, 2);
  }
}

// Create new note
// 0~36 : note (C3~B5) for 3 octaves
// 37 : rest
// 38 : continue previous note (testing)
function newNote() {
  return floor(random(0,38));
}

// Crossover options
crossover = {
  singlePoint : function(song1, song2) {
    // A new child
    const N = song1.notes.length;
    let offspring = new Song(N);

    // Single-point cross-over
    let midpoint = floor(random(N));

    for (let i = 0; i < N; i++) {
      if (i > midpoint) offspring.notes[i] = song1.notes[i];
      else offspring.notes[i] = song2.notes[i];
    }
    return offspring;
  }
}

// Mutation options
mutation = {
  // Based on a mutation probability, picks a new random character
  singleFlip : function(song) {
    for (let i = 0; i < song.notes.length; i++) {
      if (random() <= mutation_rate) {
        song.notes[i] = newNote();
      }
    }
  }
}