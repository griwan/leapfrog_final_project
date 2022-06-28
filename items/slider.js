class Slider{
    constructor(parent){
        this.parent = parent;
        this.element = document.createElement('input');
        this.element.min = '0';
        this.element.max = '10';
        this.element.value = '0'; 
        this.element.type ='range';
        this.element.id = 'name';
        this.parent.appendChild(this.element)
        console.log(this.element)
    }
    createEvent(f){
        this.element.addEventListener('input',e=>{
            f(e.target.value);
        })
    }
}
export default Slider;