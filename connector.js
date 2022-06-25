const play = document.getElementsByClassName('play')[0]

class AudioConnector {
    constructor(audioContext) {
        // Set the audio-context.
        this.audioContext = audioContext;
        this.nodes = {};
    }
    set_node(node){
        this.node = node;
    }
    set_output(output) {
        this.outputNode = output;
    }

    
    disconnect(){
    this.node.disconnect();

    return this.node;
    }

    destroy(){
        return this.disconnect();
    }
}


class Input extends AudioConnector {
    constructor(audioContext) {
        super(audioContext);

        this.connections = [];

    }
    set_input(stream) {
        
        this.node = this.audioContext.createMediaStreamSource(stream);
    }

    connect(node) {

        this.node.connect(node.node);
    
        return node;
        }
}

class Output extends AudioConnector{
    constructor(audioContext) {
        super(audioContext);

        if (this.audioContext) {
            this.node = audioContext.destination;
        }
    }
}

class Tuner extends AudioConnector {
    constructor(audioContext) {
        super(audioContext);
        this.lastnote = "A";
        this.noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        this.parent =  document.getElementsByClassName('amplifier')[0];


        this.element = document.createElement('div');
        this.element.classList.add('tuner');
        
        this.display = document.createElement('div');
        this.display.classList.add('display');

        this.cents = document.createElement('div');
        this.cents.classList.add('cents');

        this.ruler = document.createElement('div');
        this.ruler.classList.add('ruler');

        for(let i=0;i<=10;i++){
            let div = document.createElement('div')
            div.classList.add('cm');
            this.ruler.append(div);
        }
        this.indicator = document.createElement('div');
        this.indicator.classList.add('indicator');
        this.element.appendChild(this.ruler);
        this.element.appendChild(this.cents);

        this.cents.appendChild(this.indicator);
        this.element.appendChild(this.display);
        this.parent.appendChild(this.element);
        this.buf = new Float32Array( 2048 );
        this.nodes = {
            analyser :this.audioContext.createAnalyser()

        };

        // Set the oversample value to 4x by default.
        this.nodes['analyser'].fftSize = 2048;

  
        // Set the waveshaper-node as the input-node.
        this.node = this.nodes['analyser'];
        // Set the biquad-filter-node as the output-node.
        this.output = this.nodes['analyser'];
        this.print = setInterval(
  
        this.update.bind(this)
            
        ,100)
     
    }
 

    noteFromPitch( frequency ) {
        var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
        return Math.round( noteNum ) + 69;
    }
    frequencyFromNoteNumber( note ) {
        return 440 * Math.pow(2,(note-69)/12);
    }
    centsOffFromPitch( frequency, note ) {
        return Math.floor( 1200 * Math.log( frequency / this.frequencyFromNoteNumber( note ))/Math.log(2) );
    }
   connect(node) {

    this.output.connect(node.node);

    return node;
    }
    update(){

        this.nodes['analyser'].getFloatTimeDomainData(this.buf );
        let ac = this.autoCorrelate( this.buf, this.audioContext.sampleRate );
        if (ac == -1) {
            
            this.display.innerText = this.lastnote;
           
        } else {
            
            let pitch = ac;
            // this.display.innerText = Math.round( pitch ) ;
            var note =  this.noteFromPitch( pitch );
            this.lastnote = this.noteStrings[note%12]
            
            var detune = this.centsOffFromPitch( pitch, note );
            this.display.innerHTML = `${this.lastnote}`;
            this.display.style.backgroundColor = `rgb(${Math.abs(detune)*5},${(50-Math.abs(detune))*5},0)`;
            this.indicator.style.left = `${50+detune}%`
          
       }
        // console.log(ac);
    }
    autoCorrelate( buf, sampleRate ) {
        // Implements the ACF2+ algorithm
        var SIZE = buf.length;
        var rms = 0;
        let a,b;
        for (var i=0;i<SIZE;i++) {
            var val = buf[i];
            rms += val*val;
        }
        rms = Math.sqrt(rms/SIZE);
        if (rms<0.01) // not enough signal
            return -1;
    
        var r1=0, r2=SIZE-1, thres=0.2;
        for (var i=0; i<SIZE/2; i++)
            if (Math.abs(buf[i])<thres) { r1=i; break; }
        for (var i=1; i<SIZE/2; i++)
            if (Math.abs(buf[SIZE-i])<thres) { r2=SIZE-i; break; }
    
        buf = buf.slice(r1,r2);
        SIZE = buf.length;
    
        var c = new Array(SIZE).fill(0);
        for (var i=0; i<SIZE; i++)
            for (var j=0; j<SIZE-i; j++)
                c[i] = c[i] + buf[j]*buf[j+i];
    
        var d=0; while (c[d]>c[d+1]) d++;
        var maxval=-1, maxpos=-1;
        for (var i=d; i<SIZE; i++) {
            if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
            }
        }
        var T0 = maxpos;
    
        var x1=c[T0-1], x2=c[T0], x3=c[T0+1];
        a = (x1 + x3 - 2*x2)/2;
        b = (x3 - x1)/2;
        if (a) T0 = T0 - b/(2*a);
    
        return sampleRate/T0;
    }
    
};


  const audioContext = new AudioContext();
  const input = new Input(audioContext);
  const output = new Output(audioContext);
  const dist = new Tuner(audioContext);

  
  setupContext()
  
  
  async function setupContext(){
      const guitar = await getGuitar();
      if(audioContext.state ==='suspended'){
          await audioContext.resume()
      }
 
      input.set_input(guitar)
      console.log(input)
      input.connect(dist)
    //   .connect(output);
      
  }
  function getGuitar(){
      return navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppression: true,
            latency: 50
          }
      })
  }
  
