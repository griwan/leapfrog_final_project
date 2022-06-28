
import AudioConnector from "../audioConnector.js";

class Distortion extends AudioConnector {
    constructor(audioContext) {
        super(audioContext);
        this.buffer = null;
 
        
        this.element = document.createElement('div');
        this.element.classList.add('input-node');
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
        this.intensity = 600;

        // The default gain is 1.
        this.gain = 1;

        // // The lowpass filter is turned off by default.
   
        this.nodes['waveshaper'].curve = this.calculateDistortionCurve(this.intensity);
        this.nodes['gainNode'].gain.value = this.gain;
        this.nodes['gainNode2'].gain.value = 1 / this.gain;

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

   connect(node) {

    this.output.connect(node.node);

    return node;
    }
}

export default Distortion;