class AudioConnector {
    constructor(audioContext) {
        // Set the audio-context.
        this.audioContext = audioContext;
        this.nodes = {};
    }
    set_node(node){
        this.node = node;
    }
    set_output(output) {
        this.outputNode = output;
    }

    
    disconnect(){
    this.node.disconnect();

    return this.node;
    }

    destroy(){
        return this.disconnect();
    }
}

export default AudioConnector;