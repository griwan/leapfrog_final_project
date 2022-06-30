import AudioConnector from "../audioConnector.js";
import Slider from "../../items/slider.js";
class Reverb extends AudioConnector {
    constructor(audioContext, buffer) {
        super(audioContext);
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
        this.nodes['outputGainNode'].gain.value = 1;
        // Set the default wetness to 0.5
        this.wet = 0.5;
        this.nodes['wetGainNode'].gain.value = this.wet;
        // Set the default level to 1
        this.level = 1;
        this.roomSize = 1;
        this.nodes['levelGainNode'].gain.value = this.level;
        this.buffer = this.impulseResponse(this.roomSize,10,false);
        this.nodes['convolverNode'].buffer = this.buffer;

        this.sliderRoom  = new Slider(this.element,this.roomSize,1);
        this.sliderRoom.createEvent(this.setRoom.bind(this))

        this.sliderWet  = new Slider(this.element,this.nodes.wetGainNode.gain.value,0.1);
        this.sliderWet.createEvent(this.setRoom.bind(this))

        this.sliderGain  = new Slider(this.element,this.nodes.levelGainNode.gain.value,0.1);
        this.sliderGain.createEvent(this.setRoom.bind(this))
      
 
    }
    setRoom(val){
        this.buffer = this.impulseResponse(val,10,false);
        this.nodes['convolverNode'].buffer = this.buffer;
    }
    setWet(val){
        this.nodes.wetGainNode.gain.value = val/10;
    }
    setLevel(val){
        this.nodes.levelGainNode.gain.value= val/10;
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