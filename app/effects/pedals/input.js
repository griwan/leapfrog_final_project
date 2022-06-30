import AudioConnector from '../audioConnector.js';
import Slider from '../../items/slider.js';

class Input extends AudioConnector {
    constructor(audioContext) {
        super(audioContext);

        this.element = document.createElement('div');
        this.element.classList.add('effects-container');
        let h = document.createElement('h1');
        h.innerHTML = 'Input';
        this.element.appendChild(h);
        this.output = audioContext.createGain(),
        this.parent = document.getElementsByClassName('amplifier')[0];
        this.parent.appendChild(this.element);
      
        this.output.gain.value = 5;
        this.node = this.output;
        this.connections = [];
        this.slider  = new Slider(this.element,this.output.gain.value,1);
 
        this.slider.createEvent(this.set_gain.bind(this)
        )

    }
    set_gain(val){
       this.output.gain.value = val;
    }
    set_input(stream) {
        
       this.input = this.audioContext.createMediaStreamSource(stream);
       this.input.connect(this.output);
    }


}

export default Input;