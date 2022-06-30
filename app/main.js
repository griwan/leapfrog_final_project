

  function handleFiles(event) {
    var files = event.target.files;
    let source = document.getElementById('src')
    // source.attributes("src", URL.createObjectURL(files[0]));
    source.src =URL.createObjectURL(files[0]) 

    document.getElementById("audio").load();
}

document.getElementById("upload").addEventListener("change", handleFiles, false);

import Metronome from './effects/metronome.js';
import Amplifier from './items/Amplifer.js';

let initData = [];
const audioContext = new AudioContext();
const amp = new Amplifier();
const metronome = new Metronome(audioContext);
async function getapi() {
    
  // Storing response
const response  = await fetch('http://localhost:3000/get_saves/', {
    method: 'GET',
    headers: {
     
    },
  });
  
  // Storing data in form of JSON
  var data = await response.json();
  console.log(data[0].effects);
  getUserInput(data);
      // data[0].effects;


}
getapi()

function getUserInput(temp){
  const overlay = document.getElementsByClassName('overlay')[0];
  let select = document.createElement("select");
  select.name = "saves";
  select.id = "saves";
  select.innerHTML = `<option disabled selected value> -- select an option -- </option>`

  temp.forEach((e,index)=>{
    let option = document.createElement("option");
    option.value = index;
    option.text = e.name;
    select.appendChild(option);
  })
   
  let label = document.createElement("label");
  label.innerHTML = "Load Presets "
  label.htmlFor = "saves";

  overlay.appendChild(label).appendChild(select);
  select.onchange = (e)=>{
    console.log(select.value)
    initData = temp[select.value].effects
    setupContext()
    overlay.style.display = "none";
  }
 
}
async function setupContext(){
      const guitar = await getGuitar();
      if(audioContext.state ==='suspended'){
          await audioContext.resume()
      }
      amp.init(audioContext,initData,guitar);
      amp.effectsConnect();      
}
function getGuitar(){
      return navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppression: true,
            latency: 0
          }
      })
}
  