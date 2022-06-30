import AudioConnector from "../audioConnector.js";


import VerticalSlider from "../../items/verticalSliders.js"

class Equalizer extends AudioConnector {
    constructor(audioContext,data) {
        super(audioContext);

        this.data = data || {
          name:"equalizer",
          params:{
              gain:[10,10,10,10,10,10,10]
          }
      };
        this.parent = document.getElementsByClassName('amplifier')[0];
        this.frequencies =[100,500,1000,4000,8000,1000,16000];    
        this.filters = []; 
     
        this.element = document.createElement('div');
        this.element.classList.add('effects-container','equalizer');

        this.display = document.createElement('div');
        this.display.classList.add('sliders');
        this.element.appendChild(this.display);
        
        this.parent.appendChild(this.element);
     
        this.filters.push( 
            new BiquadFilterNode(audioContext, {
       
            type: 'lowshelf',
            frequency:this.frequencies[0],
            gain: this.data.params.gain[0]
          }
        ))
        for(let i=1;i<this.frequencies.length-1;i++){
            this.filters.push( 

               new BiquadFilterNode(audioContext, {
                    Q: Math.SQRT1_2,
                    type: 'peaking',
                    frequency:this.frequencies[i],
                    gain: this.data.params.gain[i]
                  }
                )
            )

        }
        this.filters.push( 
            new BiquadFilterNode(audioContext, {
            type: 'highshelf',
            frequency:this.frequencies[this.frequencies.length-1],
            gain:this.data.params.gain[6]
          }
        ))

        

        for(let j=0;j<this.filters.length-1;j++){
            this.filters[j].connect(this.filters[j+1]);
        }
       
        this.node = this.filters[0];
        this.output = this.filters[6];
   
        this.setupSliders();
    }
  
    setupSliders(){
      this.filters.forEach((filter,i)=>{
    
        let temp = new VerticalSlider(this.element,filter.gain.value,2,`${filter.frequency.value}`)
        let event = function(e){
          filter.gain.value =e*2;
          this.data.params.gain[i]= e*2;
        }
        temp.createEvent(event.bind(this))
      })
    }
}




export default Equalizer;

