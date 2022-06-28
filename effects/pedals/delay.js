import AudioConnector from "../audioConnector.js";
class Delay extends AudioConnector {
    constructor(audioContext) {
        super(audioContext);

        this.nodes = {
            inputGainNode: audioContext.createGain(), // Create the input and output nodes of the effect
            outputGainNode: audioContext.createGain(),
            wetGainNode: audioContext.createGain(), // Create the gain-node we'll use to controll the wetness of the delay
            durationGainNode: audioContext.createGain(), // Create the gain node we'll use to controll the duration of the delay
            delayNode: audioContext.createDelay() // Create the delay node
        };

        // Wire it all up
        this.nodes['inputGainNode'].connect(this.nodes['wetGainNode']);
        this.nodes['inputGainNode'].connect(this.nodes['delayNode']);
        this.nodes['durationGainNode'].connect(this.nodes['delayNode']);
        this.nodes['delayNode'].connect(this.nodes['durationGainNode']);
        this.nodes['delayNode'].connect(this.nodes['outputGainNode'])
        this.nodes['wetGainNode'].connect(this.nodes['outputGainNode'])

        // Set the input gain-node as the input-node.
        this.node = this.nodes['inputGainNode'];
        // Set the output gain-node as the output-node.
        this.output = this.nodes['outputGainNode'];
        this.nodes['wetGainNode'].gain.value = 0.2
      
        this.nodes['delayNode'].delayTime.value = 0.5
        this.nodes['durationGainNode'].gain.value = 0.3;

    }
 

    
   connect(node) {

    this.output.connect(node.node);

    return node;
    }
};

export default Delay;