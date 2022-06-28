
const play = document.getElementsByClassName('play')[0]

      
class Equalizer{
    constructor(audioCtx){
        this.frequencies =[];
        this.context = audioCtx;
        let division = 7;
        let minFreq = 100
        
        for(let i=1;i<=division;i++){
            this.frequencies.push({ 
                name:`$freq`,
                slider : new Slider(),
                filter : new BiquadFilterNode(this.context, {
                    type: 'peaking',
                    frequency:minFreq*i<300?minFreq*i:Math.floor(minFreq*i*2.2),
                    gain: 2
                  })
            })

        }
    }
    createSlider(){
        this.frequencies.forEach(e=>{
            const print = function(a){
                const value = parseFloat(a)
                e.filter.gain.value.setTargetAtTime(value, context.currentTime, .01)
                console.log(e.filter.gain)
            }
            e.slider.createEvent(print)
            
        })
    }
    connector(){
       s = []
        this.frequencies.forEach(e=>{
            s.push(e.filter)
        })
      return s;
    }
}





