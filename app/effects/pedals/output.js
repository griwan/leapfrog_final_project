import AudioConnector from '../audioConnector.js';

class Output extends AudioConnector{
    constructor(audioContext,data) {
        super(audioContext);
        this.data = data || {
            name:"output",
            params:{
             
            }
        };
        if (this.audioContext) {
            this.node = audioContext.destination;
        }
    }
}
export default Output;