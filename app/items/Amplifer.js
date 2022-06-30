import Delay from "../effects/pedals/delay.js";
import Equalizer from "../effects/pedals/equalizer.js";
import Distortion from "../effects/pedals/distortion.js";
import Reverb from "../effects/pedals/reverb.js";
import Tuner from "../effects/pedals/tuner.js";
import Input from "../effects/pedals/input.js";
import Output from "../effects/pedals/output.js";

class Amplifier{
    init(audioContext,data,output){
        this.effects = [];
        this.output = output;
        this.audioContext = audioContext;
        this.element = document.getElementsByClassName('menu')[0];
       
        this.createMenu();
    
        data.forEach(e=>{
          this.effects.push(new e.object(this.audioContext))
        
        })
        this.effects[0].set_input(this.output);
     
    }
    createMenu(){
        let header = document.createElement('h1');
        header.innerHTML = "Add Effects";
        this.element.appendChild(header)
        this.addDistortion = document.createElement('button');
        this.addDistortion.classList.add('btn')
        this.addDistortion.innerHTML = "Distortion"
        this.addDistortion.onclick = function(){
            this.addEffects(Distortion)
        }.bind(this);
        this.addDelay = document.createElement('button');
        this.addDelay.classList.add('btn')
        this.addDelay.innerHTML = "Delay"
        this.addDelay.onclick = function(){
            this.addEffects(Delay)
        }.bind(this);
        this.addReverb = document.createElement('button');
        this.addReverb.classList.add('btn')
        this.addReverb.innerHTML = "Reverb"
        this.addReverb.onclick = function(){
            this.addEffects(Reverb)
        }.bind(this);

        this.addEqualizer = document.createElement('button');
        this.addEqualizer.classList.add('btn')
        this.addEqualizer.innerHTML = "Equalizer"
        this.addEqualizer.onclick = function(){
            this.addEffects(Equalizer)
        }.bind(this);
        this.element.appendChild(this.addDelay);
        this.element.appendChild(this.addDistortion);
        this.element.appendChild(this.addReverb);
        this.element.appendChild(this.addEqualizer);
    }
    addEffects(object){
        this.effectsDisconnect();
        this.effects.splice(this.effects.length-1, 0, new object(this.audioContext));
        this.effectsConnect();
        console.log(this.effects);
      
      }
      effectsConnect(){
        for(let i=0;i<this.effects.length-1;i++){
          this.effects[i].connect(this.effects[i+1])
        }
    }
    effectsDisconnect(){
      for(let i=0;i<this.effects.length-1;i++){
        this.effects[i].disconnect(this.effects[i+1])
      }
    }
}

export default Amplifier;