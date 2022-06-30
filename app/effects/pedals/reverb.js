import AudioConnector from "../audioConnector.js";
import Slider from "../../items/slider.js";
class Reverb extends AudioConnector {
    constructor(audioContext,data) {
        super(audioContext);
        this.data = data || {
            name:"reverb",
            params:{
             wet:0.5,
             level:1,
             room:1

            }
        };
        this.element = document.createElement('div');
        this.element.classList.add('effects-container');
        let h = document.createElement('h1');
        h.innerHTML = 'Reverb';
        this.element.appendChild(h);
     
        this.parent = document.getElementsByClassName('amplifier')[0];
        this.parent.appendChild(this.element);

        this.nodes = {
            inputGainNode: audioContext.createGain(), // Create the input and output gain-node
            outputGainNode: audioContext.createGain(),
            convolverNode: audioContext.createConvolver(), // Create the convolver node to create the reverb effect
            wetGainNode: audioContext.createGain(), // Create the wetness controll gain-node
            levelGainNode: audioContext.createGain() // Create the level controll gain-node
        };

        // Wire it all up
        this.nodes['inputGainNode'].connect(this.nodes['convolverNode']);
        this.nodes['inputGainNode'].connect(this.nodes['wetGainNode']);
        this.nodes['convolverNode'].connect(this.nodes['levelGainNode']);
        this.nodes['levelGainNode'].connect(this.nodes['outputGainNode']);
        this.nodes['wetGainNode'].connect(this.nodes['outputGainNode']);

        // Set the input gain-node as the input-node.
        this.node = this.nodes['inputGainNode'];

        // Set the output gain-node as the output-node.
        this.output = this.nodes['outputGainNode'];
        this.level = this.data.params.level;

        this.nodes['outputGainNode'].gain.value = 1;
       
        this.wet = this.data.params.wet;
        this.nodes['wetGainNode'].gain.value = this.wet;
       
    
        this.roomSize =this.data.params.room;
        this.nodes['levelGainNode'].gain.value = this.level;
        this.buffer = this.impulseResponse(this.roomSize,10,false);
        this.nodes['convolverNode'].buffer = this.buffer;

        this.sliderRoom  = new Slider(this.element,this.roomSize,1,"Room Size");
        this.sliderRoom.createEvent(this.setRoom.bind(this))

        this.sliderWet  = new Slider(this.element,this.nodes.wetGainNode.gain.value,0.1,"Wet/Dry");
        this.sliderWet.createEvent(this.setWet.bind(this))

        this.sliderGain  = new Slider(this.element,this.nodes.levelGainNode.gain.value,0.1,"Gain");
        this.sliderGain.createEvent(this.setLevel.bind(this))
      
 
    }
    setRoom(val){
        this.buffer = this.impulseResponse(val,10,false);
        this.nodes['convolverNode'].buffer = this.buffer;
        this.data.params.room = val;
    }
    setWet(val){
        this.nodes.wetGainNode.gain.value = val/10;
        this.data.params.wet = val/10;
    }
    setLevel(val){
        this.nodes.levelGainNode.gain.value= val/10;
        this.data.params.level = val/10;
    }
    impulseResponse( duration, decay, reverse ) {
    var sampleRate = this.audioContext.sampleRate;
    var length = sampleRate * duration;
    var impulse = this.audioContext.createBuffer(2, length, sampleRate);
    var impulseL = impulse.getChannelData(0);
    var impulseR = impulse.getChannelData(1);

    if (!decay)
        decay = 2.0;
    for (var i = 0; i < length; i++){
      var n = reverse ? length - i : i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }
    return impulse;
    }

    set_buffer(buffer) {
        this.audioContext.decodeAudioData(buffer, buffer => {
            // Set the internal buffer value
            this.buffer = buffer;

            // Set the buffer gain-node value
           this.nodes['convolverNode'].buffer = this.buffer;
        });
    }

};


export default Reverb;