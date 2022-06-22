const volume = document.getElementById('volume')


const context = new AudioContext()
const analyserNode = new AnalyserNode(context, { fftSize: 256 })
const gainNode = new GainNode(context, { gain: volume.value})

eq = new Equalizer(context);
eq.createSlider();

setupEventListeners()
setupContext()


function setupEventListeners() {


  volume.addEventListener('input', e => {
    const value = parseFloat(e.target.value)
    gainNode.gain.setTargetAtTime(value, context.currentTime, .01)
  })


}

async function setupContext() {
  const guitar = await getGuitar()
  if (context.state === 'suspended') {
    await context.resume()
  }
  const source = context.createMediaStreamSource(guitar)
  eq.frequencies.forEach(e=>{
    source.connect(e.filter);
    console.log(e.filter)
  })
 source
  
    
    .connect(context.destination)
  console.log(source)
}

function getGuitar() {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      autoGainControl: false,
      noiseSuppression: false,
      latency: 1
    }
  })
}

