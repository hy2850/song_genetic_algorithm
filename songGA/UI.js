// Frequency for notes
FREQ = [130.8128, 138.5913, 146.8324, 155.5635, 164.8138, 174.6141, 184.9972, 195.9977, 207.6523, 220.0, 233.0819, 246.9417, 261.6256, 277.1826, 293.6648, 311.127, 329.6276, 349.2282, 369.9944, 391.9954, 415.3047, 440.0, 466.1638, 493.8833, 523.2511, 554.3653, 587.3295, 622.254, 659.2551, 698.4565, 739.9888, 783.9909, 830.6094, 880.0, 932.3275, 987.7666]

// adjustable constants for Beat
const h = 40; // gap between lines
const r = h/2; // radius of the circle note
const linelen = 5*r;

class Beat {
    //@args nth : idx of the note in Song.notes / pos : pos of this p5js object 
    constructor(nth, pos) {
      this.nth = nth;
      this.x = pos.x;
      this.y = pos.y;
    }
  
    drawNote(val, color='black'){
        let noteNum = val % 12;
        
        const idx = Math.floor((noteNum+1)/2); // where to put the note
        let noteX = this.x + (linelen/2), noteY = this.y + 6*h - idx*(h/2)
        let noteWidth = 2*r + (color == 'red' ? 5 : 0), noteHeight = 2*r-10;
        // note figure - elipse, target (black) and best note (red) does not overlap

        fill(color);
        stroke(color);
        textSize(36);

        // Rest
        if(val == 36){
            textSize(60);
            text('𝄽', noteX, this.y + 4*h);
            return;
        }

        // Sharp
        let isSharp = false;
        const SHARP = [1, 3, 6, 8, 10];
        if(SHARP.includes(noteNum)){
            noteNum--;
            text('#', noteX - noteWidth, noteY + 10);
        }

        // Octave - indicated by the arrow on the top of the beat
        switch(floor(val/12)){
            case 0:
                text('↓', noteX - r + (color === 'red' ? 10 : 0), this.y);
                break
            case 2:
                text('↑', noteX - r + (color === 'red' ? 10 : 0), this.y);

                break
        }

        angleMode(DEGREES);
        translate(noteX, noteY);
        rotate(-10);

        ellipse(0, 0, noteWidth, noteHeight);

        rotate(10);
        translate(-noteX, -noteY);

        if (noteNum == 0)
            line(noteX - noteWidth + 8, noteY, noteX + noteWidth - 8, noteY); // for note 'C'

        stroke('black');
    }

    play(sheetH, playTarget = true){
        stroke('black');
        fill(0, 0, 0, 0);
        rect(this.x, this.y, linelen, sheetH);
        
        const note = playTarget ? target[this.nth] : bestSong.notes[this.nth];
        let osc = new p5.Oscillator('sine');
        osc.freq(FREQ[note], 0.2);
        osc.amp(0, 0.5);
        osc.start();
    }


    display() {    
        console.log("Hey")
        for(let i = 1; i <= 5; i++){
            let y = this.y + h * i;
            line(this.x, y, this.x + linelen, y);
        }
        
        const ans = target[this.nth];
        let drawTargetBlack = true; 
        if(bestSong) {
            const best = bestSong.notes[this.nth];

            // Matching note
            if (ans === best){
                this.drawNote(target[this.nth], 'blue');
                drawTargetBlack = false;
            }
            else
                this.drawNote(bestSong.notes[this.nth], 'red');
        }
        if(drawTargetBlack)
            this.drawNote(target[this.nth], 'black');
    }
}

class Sheet {
    constructor(sheetX, sheetY, sheetH){
        this.sheet = []       
        this.sheetH = sheetH; 
        for(let i=0; i<targetLen; i++){
            this.sheet[i] = new Beat(i, {x: sheetX + linelen*(i%beatsPerSheet), y: sheetY + sheetH * floor(i/beatsPerSheet)});
        }
    }
    
    display(){
        for(const b of this.sheet)
            b.display();
    }

    playMusic(playTarget = true){
        isLoopRunning = false;
        noLoop();

        let time = 1;
        for(const b of this.sheet){
            setTimeout(()=>{
                b.play.call(b, this.sheetH, playTarget);
                setTimeout(sheetUpdate, 300); // delay view reset
            }, 500*time++);
        }
        // 📝 Further work) Allow only one 'playMusic' execution
        /* 
        playMusic 시, playing = true로 두고,
        play(idx)를 재귀로 구현해서 setTimeout으로 시간 차 두고 play(idx+1) 호출.
        End cond는 idx > N 일때 혹은 playing == false 일때
       
        이러면 각 beat마다 테두리 표시 못해줌 + 

        > stop music 기능에 활용!
        */
    }
}

// Helper for formatting array into string
// [1, 2, 30, 4] ->  1  2 30  4
function arrayToString(arr){
    let ret = "";
    for(const num of arr){
        let s = num.toString();
        if (s.length < 2)
            s = "&nbsp" + s;
        ret += s + "&nbsp";
    }
    return ret;
}

let genHTML, targetHTML, bestHTML, infoHTML, allTitle, allBody;
function textUpdate() {
    genHTML.html(`Generation : ${generation}`);
    compareHTML.html(`
    &emsp;&emsp;&emsp;&emsp;Target     : ${arrayToString(target)}<br>
    Best individual : ${arrayToString(bestSong.notes)}<br>
    `)

    infoHTML.html(`
    Average fitness : ${population.getAverageFitness()}<br>
    Population size : ${popsize}<br>
    Mutation rate : ${floor(mutation_rate * 100)}%<br>
    `);

    let allTitleTxt = `Population size ${popsize} - sorted in decreasing order of fitness<br>`;  
    allTitle.html(allTitleTxt);
    
    let allBodyTxt = "";
    for(const song of population.parentPop){
        allBodyTxt += song.notes + "<br>";
    }
    allBody.html(allBodyTxt);
}

function sheetUpdate(){
    clear();
    musicSheet.display();
}
  
function textInit(X, Y){
    let span1 = createSpan('Enter population size ');
    span1.position(X, Y);
    popSizeInp = createInput();
    popSizeInp.position(X + span1.width + 50, Y);

    let span2 = createSpan('Enter mutation rate ');
    span2.position(X, Y + span1.height);
    mutRateInp = createInput();
    mutRateInp.position(popSizeInp.x, span2.y)

    // -- Add additional options --

    let span3 = createSpan('Choose fitness metric ');
    span3.position(X, span2.y + span2.height + 20);
    fitSel = createSelect();
    fitSel.class('sel'); fitSel.id('fitSel');
    fitSel.option('count correct');
    fitSel.option('distance - absolute');
    fitSel.option('distance - RMSE');
    fitSel.selected('count correct');
    fitSel.position(popSizeInp.x, span3.y);
    
    let span4 = createSpan('Parent selection method ');
    span4.position(X, span3.y + span3.height);
    selSel = createSelect();
    selSel.class('sel'); selSel.id('selSel');
    selSel.option('Roulette');
    selSel.option('Tournament');
    selSel.selected('Roulette');
    selSel.position(popSizeInp.x, fitSel.y + fitSel.height + 3);

    let span5 = createSpan('Cross-over ');
    span5.position(X, span4.y + span4.height);
    crossSel = createSelect();
    crossSel.class('sel'); crossSel.id('crossSel');
    crossSel.option('singlePoint');
    crossSel.option('uniform');
    crossSel.option('average');
    crossSel.selected('singlePoint');
    crossSel.position(popSizeInp.x, selSel.y + selSel.height + 3);

    let span6 = createSpan('Mutation ');
    span6.position(X, span5.y + span5.height);
    mutSel = createSelect();
    mutSel.class('sel'); mutSel.id('mutSel');
    mutSel.option('randomFlip');
    mutSel.option('addVal');
    mutSel.selected('randomFlip');
    mutSel.position(popSizeInp.x, crossSel.y + crossSel.height + 3);
    
    let span7 = createSpan('Next generation selection ');
    span7.position(X, span6.y + span6.height);
    genSel = createSelect();
    genSel.class('sel'); genSel.id('genSel');
    genSel.option('total replacement');
    genSel.option('gradual replacement');
    genSel.option('elitism');
    genSel.selected('total replacement');
    genSel.position(popSizeInp.x, mutSel.y + mutSel.height + 3);


    let startButton = createButton('start simulation');
    startButton.class('start');
    startButton.position(X, genSel.y + genSel.height + 10);

    genHTML = createDiv('gen'); genHTML.class('gen');
    compareHTML = createP('comp'); compareHTML.class('comp');
    infoHTML = createP('info'); infoHTML.class('info');
    allTitle = createP('all'); allTitle.class('all-title');
    allBody = createP('allBody'); allBody.class('all-body');
    allTitle.parent('all-container'); allBody.parent('all-container');

    genHTML.position(X, startButton.y + startButton.height + 20);
    compareHTML.position(X, genHTML.y + genHTML.height + 30);
    infoHTML.position(X, compareHTML.y + compareHTML.height + 80);
    //allHTML.position(1200, 10);

    let playTarget = createButton('play answer (target)');
    playTarget.class('play');
    playTarget.position(X, infoHTML.y + infoHTML.height + 100)
    playTarget.mousePressed(()=>{
      musicSheet.playMusic(true);
    });

    let playBest = createButton('play best individual');
    playBest.class('play');
    playBest.position(playTarget.x + playTarget.width + 10, playTarget.y);
    playBest.mousePressed(()=>{
      musicSheet.playMusic(false);
    });

    return {
        startButton: startButton,
        popSizeInp: popSizeInp,
        mutRateInp: mutRateInp,
        fitSel:fitSel
    };
}