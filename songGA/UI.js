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
        
        // Sharp
        let isSharp = false;
        const SHARP = [1, 3, 6, 8, 10];
        if(SHARP.includes(noteNum)){
            noteNum--;
            isSharp = true;
        }

        // Octave
        let octave = 0;
        switch(floor(val/12)){
            case 0:
                octave = -1;
                break
            case 2:
                octave = 1;
                break
        }

        const idx = Math.floor((noteNum+1)/2);
        let noteX = this.x + (linelen/2), noteY = this.y + 6*h - idx*(h/2)
        let noteWidth = 2*r + (color == 'red' ? 5 : 0), noteHeight = 2*r-10;

        // translate(noteX, noteY);
        // rotate(-PI / 12);

        fill(color);
        stroke(color);
        ellipse(noteX, noteY, noteWidth, noteHeight);

        if (noteNum == 0)
            line(noteX - noteWidth + 8, noteY, noteX + noteWidth - 8, noteY); // for note 'C'
        stroke('black')
        //noFill();

        // rotate(PI / 12);
        // translate(0, 0);
    }

    play(){

    }

    display() {    
        console.log("Hey")
        for(let i = 1; i <= 5; i++){
            let y = this.y + h * i;
            line(this.x, y, this.x + linelen, y);
        }
        
        const ans = target[this.nth];
        let drawTarget = true; 
        if(bestSong) {
            const best = bestSong.notes[this.nth];
            if (ans === best){
                this.drawNote(target[this.nth], 'blue');
                drawTarget = false;
            }
            else
                this.drawNote(bestSong.notes[this.nth], 'red');
        }
        if(drawTarget)
            this.drawNote(target[this.nth], 'black');

        //if(bestSong && target[this.nth] != bestSong.notes[this.nth]) this.drawNote(bestSong.notes[this.nth], 'red');
    }
  }