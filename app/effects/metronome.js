class Metronome{
    constructor(audioContext){
    this.audioContext = audioContext;
    this.buf = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
    this.channel = this.buf.getChannelData(0);
    this.phase = 0;
    this.amp = 1;
    this.durationFrames = audioContext.sampleRate / 50;
    this.f = 330;
    this.state = 0;

    for (let i = 0; i < this.durationFrames; i++) {
        this.channel[i] = Math.sin(this.phase) * this.amp;
        this.phase += 2 * Math.PI * this.f / audioContext.sampleRate;
        if (this.phase > 2 * Math.PI) {
            this.phase -= 2 * Math.PI;
        }
    this.amp -= 1 / this.durationFrames;
  }
  this.createElement();
  this.source = audioContext.createBufferSource();
  this.source.buffer = this.buf;
  this.source.loop = true;
  this.source.loopEnd = 1 / (this.getTempo() / 60)

  this.source.start(0);
}

createElement(){
   this.element = document.getElementsByClassName('metronome')[0];
   let input = document.createElement("input");
   let header = document.createElement('h1');
   header.innerHTML = "Metronome"
   input.id = "metronome-input"
   input.type = "number";
   input.min = 30;
   input.max = 300;
   input.step = 0.1;
   input.value = 133;
   let button = document.createElement("button");
   button.innerText = "start";
   this.element.appendChild(input);
   this.element.appendChild(header);
   this.element.appendChild(button);

  button.onclick = function() {
    if(this.state){
        this.source.disconnect();
        button.innerText = "start";
        this.state  = 0;
    }
    else{
        this.source.connect(this.audioContext.destination);
        
        button.innerText = "stop";
        this.state  =1;
    }
    


  
  
   }.bind(this)
   
    input.onchange = function() {
        setTimeout(function() {
            console.log(this)
            input.value = this.getTempo();
        }.bind(this), 0);
    }.bind(this)
    input.oninput = function() {
        this.source.loopEnd = 1 / (this.getTempo() / 60);
    }.bind(this)

    }

     getTempo() {
  
        return Math.min(300, Math.max(30, parseFloat(document.getElementById("metronome-input").value)))
      }


}

export default Metronome;