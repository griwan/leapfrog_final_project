  import Input from '/effects/pedals/input.js';
  import Output from '/effects/pedals/output.js';
  import Delay from '/effects/pedals/delay.js';
  import Reverb  from '/effects/pedals/reverb.js';
  import Disortion from '/effects/pedals/distortion.js';
  import Tuner from '/effects/pedals/tuner.js';
  import Equalizer from './effects/pedals/equalizer.js';
  import Amplifer from './items/Amplifer.js';

import Amplifier from './items/Amplifer.js';


  const initData = [
    {
      
     object:Input,
      gain:0.5
    },
    {
      object:Tuner,
    
    },
    {
      object:Output
    }
  ]

const audioContext = new AudioContext();
const amp = new Amplifier();

// let effects = []



// initData.forEach(e=>{
//   effects.push(new e.object(audioContext))

// })

  setupContext()
  
  
  async function setupContext(){
      const guitar = await getGuitar();
      if(audioContext.state ==='suspended'){
          await audioContext.resume()
      }
 
      // effects[0].set_input(guitar)
      amp.init(audioContext,initData,guitar);
      amp.effectsConnect();
     
      
     

     
      
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
  