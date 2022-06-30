import Delay from "../effects/pedals/delay.js";
import Equalizer from "../effects/pedals/equalizer.js";
import Distortion from "../effects/pedals/distortion.js";
import Reverb from "../effects/pedals/reverb.js";
import Tuner from "../effects/pedals/tuner.js";
import Input from "../effects/pedals/input.js";
import Output from "../effects/pedals/output.js";

class Amplifier{
    init(audioContext,data,output){
       
        this.data = [...data];
        this.default = this.mapClasses(data);
        this.effects = [];
        this.output = output;
        this.audioContext = audioContext;
        this.element = document.getElementsByClassName('menu')[0];
       
        this.createMenu();
     
  
        this.default.forEach(e=>{
          
          this.effects.push(new e.class(this.audioContext,e))
        
        })
        this.effects[0].set_input(this.output);
     
    }
    mapClasses(d){
      d.forEach(e=>{
        switch(e.name){
          case "input":
            e.class = Input
            break;
          case "output":
            e.class = Output
            break;
            case "delay":
              e.class = Delay
              break;
          case "tuner":
            e.class = Tuner
            break;
            case "distortion":
              e.class = Distortion
              break;
              case "reverb":
                e.class = Reverb
                break;
                case "equalizer":
                  e.class = Equalizer
                  break;
        }
       })
       return [...d];
    }
    reset(){
      for(let i = 0;i<this.effects.length-1;i++){
        this.effects[i].destroy();
      }
      this.effects = this.effectsDisconnect();
      
      this.default.forEach(e=>{
        console.log(e);
        this.effects.push(new e.class(this.audioContext,e))
      })
   
      this.effects[0].set_input(this.output);
      this.effectsConnect();
      
    
    }
    async saveSession(fname){
      const response  = await fetch('http://localhost:3000/save', {
     method: 'POST',
     headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
      body :JSON.stringify({
        name:fname,
        effects:this.data
      })
    });
    }
    createMenu(){
        let header = document.createElement('h1');
        header.innerHTML = "Controls";
        this.element.appendChild(header)
        this.saveBtn = document.createElement('button');
        this.saveBtn.classList.add('btn','save-btn')
        this.saveBtn.innerHTML = "Save"
        this.saveBtn.onclick = function(){
          const curr = new Date();
          let name = prompt("Save As", curr.toString());
          this.saveSession(name);
        }.bind(this);
        
        this.loadBtn = document.createElement('button');
        this.loadBtn.classList.add('btn','load-btn')
        this.loadBtn.innerHTML = "Load"
        this.loadBtn.onclick = function(){
          location.reload();
        };

        this.resetBtn = document.createElement('button');
        this.resetBtn.classList.add('btn','reset-btn')
        this.resetBtn.innerHTML = "Reset"
        this.resetBtn.onclick = function(){
            this.reset()
        }.bind(this);
        this.addDistortion = document.createElement('button');
        this.addDistortion.classList.add('btn','effects-btn')
        this.addDistortion.innerHTML = "Distortion"
        this.addDistortion.onclick = function(){
            this.addEffects(Distortion)
        }.bind(this);
        this.addDelay = document.createElement('button');
        this.addDelay.classList.add('btn','effects-btn')
        this.addDelay.innerHTML = "Delay"
        this.addDelay.onclick = function(){
            this.addEffects(Delay)
        }.bind(this);
        this.addReverb = document.createElement('button');
        this.addReverb.classList.add('btn','effects-btn')
        this.addReverb.innerHTML = "Reverb"
        this.addReverb.onclick = function(){
            this.addEffects(Reverb)
        }.bind(this);

        this.addEqualizer = document.createElement('button');
        this.addEqualizer.classList.add('btn','effects-btn')
        this.addEqualizer.innerHTML = "Equalizer"
        this.addEqualizer.onclick = function(){
            this.addEffects(Equalizer)
        }.bind(this);

        this.element.appendChild(this.saveBtn);
        this.element.appendChild(this.loadBtn);
        this.element.appendChild(this.resetBtn);
        this.element.appendChild(this.addDelay);
        this.element.appendChild(this.addDistortion);
        this.element.appendChild(this.addReverb);
        this.element.appendChild(this.addEqualizer);
    }
    addEffects(object){
        this.effectsDisconnect();
        let temp = new object(this.audioContext);
        this.effects.splice(this.effects.length-1, 0, temp);
        this.data.splice(this.data.length-1, 0, 
          {
            name :temp.data.name,
            params:temp.data.params,
        
          }
          );
        this.effects[this.effects.length-1].data= this.data[this.data.length-2];
        console.log(this.data)
        this.effectsConnect();
        // console.log(this.effects);
      
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
      return [];
    }
}

export default Amplifier;