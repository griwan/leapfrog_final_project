import AudioConnector from "../audioConnector.js";
import EqSliders from "../../items/equalizerSlider.js"; 

class Equalizer extends AudioConnector {
    constructor(audioContext) {
        super(audioContext);
        this.parent = document.getElementsByClassName('amplifier')[0];
        this.frequencies =[100,500,1000,4000,8000,1000,16000];    
        this.filters = [];   
        this.element = document.createElement('div');
        this.element.classList.add('effects-container','equalizer');

     

        this.display = document.createElement('div');
        this.display.classList.add('sliders');
        this.element.appendChild(this.display);
        this.frequencies.forEach(e=>{
            let temp = document.createElement('div')
            temp.classList.add('range-slider');
            temp.innerHTML = `
            <input type="range" orient="vertical" min="0" max="100" />
            <div class="range-slider-bar"></div>
            <div class="range-slider-thumb"></div>
            `
           
            this.display.appendChild(temp);
        })
        this.parent.appendChild(this.element);
     
        this.filters.push( 
            new BiquadFilterNode(audioContext, {
       
            type: 'lowshelf',
            frequency:this.frequencies[0],
            gain: 0
          }
        ))
        for(let i=1;i<this.frequencies.length-1;i++){
            this.filters.push( 

               new BiquadFilterNode(audioContext, {
                    Q: Math.SQRT1_2,
                    type: 'peaking',
                    frequency:this.frequencies[i],
                    gain: 0
                  }
                )
            )

        }
        this.filters.push( 
            new BiquadFilterNode(audioContext, {
            type: 'highshelf',
            frequency:this.frequencies[this.frequencies.length-1],
            gain:0
          }
        ))

        

        for(let j=0;j<this.filters.length-1;j++){
            this.filters[j].connect(this.filters[j+1]);
        }
       
        this.node = this.filters[0];
        this.output = this.filters[6];
        this.sliders = EqSliders(this);
        this.setupSliders();
    }
  



    setupSliders() {
        const inputs =  [].slice.call(document.querySelectorAll('.sliders input'));
        console.log(inputs)
        let index = 1;
        inputs.forEach(input => input.setAttribute('data-slider-index', 'range' + index++));
        inputs.forEach(input => input.value = 0.1);
        inputs.forEach(input => this.sliders.updateSlider(input));
        // Cross-browser support where value changes instantly as you drag the handle, therefore two event types.
        inputs.forEach(input => input.addEventListener('input', element => this.sliders.updateSlider(input)));
        inputs.forEach(input => input.addEventListener('change', element => this.sliders.updateSlider(input)));
     
      }



}




export default Equalizer;

