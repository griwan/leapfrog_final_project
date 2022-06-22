const play = document.getElementsByClassName('play')[0]

class AudioConnector {
    constructor(audioContext) {
        // Set the audio-context.
        this.audioContext = audioContext;
        this.nodes = {};
    }



    set_audioContext(audioContext) {
        this.audioContext = audioContext;
    }



    set_node(){
        this.node = node;
    }

   connect(node) {

    this.node.connect(node.node);

    return node;
    }

    disconnect(){
    this.node.disconnect();

    return this.node;
    }

    destroy(){
        return this.disconnect();
    }
}

class Input extends AudioConnector {
    constructor(audioContext) {
        super(audioContext);

        this.connections = [];
        this._hasPermissions = false;
    }



    set_input(stream) {
        
        this.node = this.audioContext.createMediaStreamSource(stream);
    }


    connect(node) {
        // If there is no input node yet, connect when there is a node
        if (typeof this.node === 'undefined') {
            this.connections.push(node);

            return node;
        }


        this.node.connect(node.node);
        

        return node;
    }



}

class Output extends AudioConnector{
    constructor(audioContext) {
        super(audioContext);

        if (this.audioContext) {
            this.node = audioContext.destination;
        }
    }
}

async function setupContext(input_node) {
    const guitar = await getGuitar()
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

    input_node.node =guitar
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

let audioContext = new AudioContext();

play.onclick= function(e){

    const input = new Input(audioContext);
   
    setupContext(input);
    console.log(input.node);
    const output = new Output(audioContext);

    input.connect(output);
}
