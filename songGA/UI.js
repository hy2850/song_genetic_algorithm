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

    play(){

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