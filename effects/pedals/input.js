import AudioConnector from '../audioConnector.js';
import Slider from '../../items/slider.js';

class Input extends AudioConnector {
    constructor(audioContext) {
        super(audioContext);

        this.element = document.createElement('div');
        this.element.classList.add('input-node');
        let h = document.createElement('h1');
        h.innerHTML = 'Input';
        this.element.appendChild(h);
        this.inputGainNode = audioContext.createGain(),
        this.parent = document.getElementsByClassName('amplifier')[0];
        this.parent.appendChild(this.element);
        this.inputGainNode.gain.value = 0;
        this.connections = [];
        this.slider  = new Slider(this.element);
 
        this.slider.createEvent(this.set_gain.bind(this)
        )

    }
    set_gain(val){
        this.inputGainNode.gain.value = val/10;
    }
    set_input(stream) {
        
        this.node = this.audioContext.createMediaStreamSource(stream);
        this.node.connect(this.inputGainNode);
    }

    connect(node) {

        this.inputGainNode.connect(node.node);
    
        return node;
        }
}

export default Input;