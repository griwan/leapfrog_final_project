  import Input from './effects/pedals/input.js';
  import Output from './effects/pedals/output.js';
  import Delay from './effects/pedals/delay.js';
  import Reverb  from './effects/pedals/reverb.js';
  import Disortion from './effects/pedals/distortion.js'
  const audioContext = new AudioContext();
  const input = new Input(audioContext);
  const output = new Output(audioContext);
  const delay = new Delay(audioContext);
  const reverb = new Reverb(audioContext);
  const distortion = new Disortion(audioContext);
//   reverb.getInputResponseFile('./IMreverbs/Large Bottle Hall.wav').then(buffer => {
//     reverb.set_buffer(buffer)
//   });
  setupContext()
  
  
  async function setupContext(){
      const guitar = await getGuitar();
      if(audioContext.state ==='suspended'){
          await audioContext.resume()
      }
 
      input.set_input(guitar)
   
      input.connect(distortion).connect(reverb).connect(delay).connect(output);

     
      
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
  



