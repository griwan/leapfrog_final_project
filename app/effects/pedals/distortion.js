
import AudioConnector from "../audioConnector.js";
import Slider from "../../items/slider.js";

class Distortion extends AudioConnector {
    constructor(audioContext,data) {
        super(audioContext);

        this.data = data || {
            name:"distortion",
            params:{
                intensity:600,
                gain:0.4,
            }
        };
        this.buffer = null;
 
    
        this.element = document.createElement('div');
        this.element.classList.add('effects-container');
        let h = document.createElement('h1');
        h.innerHTML = 'Distortion';
        this.element.appendChild(h);

        this.parent = document.getElementsByClassName('amplifier')[0];
        this.parent.appendChild(this.element);
        
        this.connections = [];
 
        this.nodes = {
            waveshaper: this.audioContext.createWaveShaper(), // Create the waveshaper-node we'll use to create the distortion effect.
            gainNode: this.audioContext.createGain(), // Create the gain-nodes we use to increase the gain.
            gainNode2: this.audioContext.createGain(),
            biquadFilterNode: this.audioContext.createBiquadFilter() // Create the biquad-filter-node we'll use to create a lowpass filter.
        };

        // Set the oversample value to 4x by default.
        this.nodes['waveshaper'].oversample = '4x';

        // Set the type of to lowpass by default.
        this.nodes['biquadFilterNode'].type = 'lowpass';

        // Set the frequency value to 2000 by default.
       this.nodes['biquadFilterNode'].frequency.value = 2000;

        // Connect all nodes together
        this.nodes['waveshaper'].connect(this.nodes['gainNode']);
        this.nodes['gainNode'].connect(this.nodes['gainNode2']);
        this.nodes['gainNode2'].connect(this.nodes['biquadFilterNode']);

        // Set the waveshaper-node as the input-node.
        this.node = this.nodes['waveshaper'];
        // Set the biquad-filter-node as the output-node.
        this.output = this.nodes['biquadFilterNode'];

        // The default intensity is 100.
        this.intensity = this.data.params.intensity;


        this.gain = this.data.params.gain;

    
   
        this.nodes['waveshaper'].curve = this.calculateDistortionCurve(this.intensity);
        this.nodes['gainNode'].gain.value = this.gain;
        this.nodes['gainNode2'].gain.value = 1 / this.gain;
        
        this.sliderIntensity  = new Slider(this.element,this.intensity,100,"Intensity");
        
        this.sliderIntensity.createEvent(this.setIntensity.bind(this))
        this.sliderGain  = new Slider(this.element,this.nodes.gainNode.gain.value,0.1,"Gain");
        
        this.sliderGain.createEvent(this.setGain.bind(this))

    }
 
    setIntensity(val){
        this.nodes.waveshaper.curve = this.calculateDistortionCurve(val*100);
        this.data.intensity =  this.val*100;
    }
    setGain(val){
        this.nodes.gainNode.gain.value = val/10;
        this.nodes.gainNode2.gain.value = Math.floor(1/(val/10));
        this.data.gain = val/10;
    }
    
    calculateDistortionCurve(intens){
        const intensity = parseInt(intens) || 100;
        const amount = 44100;
        const deg = Math.PI / 180;
        const curve = new Float32Array(amount);
        let i = 0;
        let x;

        for (; i < amount; ++i ) {
            x = i * 2 / amount - 1;
            curve[i] = ( 3 + intensity ) * x * 20 * deg / ( Math.PI + intensity * Math.abs(x) );
        }

        return curve;
    }


}

export default Distortion;