│
├── app.js
├── population.js
└── song.js

* app
  시각화 + audio play
  각 generation의 최고 fitness 가지는 song 개체만 (+ 10 generation마다?)

* population
  argument : popsize, mutation rate, target genotype

  1. Evaluate fitness of each individual in the population
  2. Selection - Tournament (간단해서)
     Choose random K individuals, pick top 2 for parents. Repeat until offspring arr reaches popsize
  3. Create offspring
     Cross-over two parents chosen at step 2, apply mutation if probability permits
  4. Generate next population
     Gradual replacement
  
* song
  genotype (array of nums - represent note or rest), phenotype (same as genotype - can be played by app.js)
  
  
  
  cross-over - single point mix 
  mutation - iterate through genotype array, decide whether to mutate each number randomly under certain mutation probability



