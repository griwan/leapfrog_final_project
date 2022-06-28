import AudioConnector from '../audioConnector.js';

class Output extends AudioConnector{
    constructor(audioContext) {
        super(audioContext);

        if (this.audioContext) {
            this.node = audioContext.destination;
        }
    }
}
export default Output;