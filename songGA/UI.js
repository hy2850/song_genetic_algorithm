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

        // 미구현
        if(val == 36){
            // Rest
        }
        
        const idx = Math.floor((noteNum+1)/2); // where to put the note
        let noteX = this.x + (linelen/2), noteY = this.y + 6*h - idx*(h/2)
        let noteWidth = 2*r + (color == 'red' ? 5 : 0), noteHeight = 2*r-10;
        // note figure - elipse, target (black) and best note (red) does not overlap

        fill(color);
        stroke(color);
        textSize(36);

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
    }

    play(sheetH){
        stroke('black');
        fill(0, 0, 0, 0);
        rect(this.x, this.y, linelen, sheetH);
        
        const note = target[this.nth];
        osc = new p5.Oscillator('sine');
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

    playMusic(){
        isLoopRunning = false;
        noLoop();

        let time = 1;
        for(const b of this.sheet){
            setTimeout(()=>{
                b.play.call(b, this.sheetH);
                setTimeout(viewUpdate, 300); // delay view reset
            }, 500*time++);
        }
        // 📝 Further work) Allow only one 'playMusic' execution
        /* 
        playMusic 시, playing = true로 두고,
        play(idx)를 재귀로 구현해서 setTimeout으로 시간 차 두고 play(idx+1) 호출.
        End cond는 idx > N 일때 혹은 playing == false 일때
       
        이러면 각 beat마다 테두리 표시 못해줌 + 
        */
    }
}