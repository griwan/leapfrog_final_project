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
        this.element.display = "none";
        this.outputNode = output;
    }
    connect(node) {

        this.output.connect(node.node);
    
        return node;
        }
    
    disconnect(node){
    this.output.disconnect(node.node);
    

    }

    destroy(){
        return this.disconnect();
    }
}

export default AudioConnector;