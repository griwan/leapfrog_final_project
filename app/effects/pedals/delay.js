import AudioConnector from "../audioConnector.js";
import Slider from "../../items/slider.js";
class Delay extends AudioConnector {
  constructor(audioContext, data) {
    super(audioContext);
    this.data = data || {
      name: "delay",
      params: {
        wet: 0.5,
        time: 0.5,
        duration: 0.3,
      },
    };
    this.element = document.createElement("div");
    this.element.classList.add("effects-container");
    let h = document.createElement("h1");
    h.innerHTML = "Delay";
    this.element.appendChild(h);

    this.parent = document.getElementsByClassName("amplifier")[0];
    this.parent.appendChild(this.element);

    this.nodes = {
      inputGainNode: audioContext.createGain(), // Create the input and output nodes of the effect
      outputGainNode: audioContext.createGain(),
      wetGainNode: audioContext.createGain(), // Create the gain-node we'll use to controll the wetness of the delay
      durationGainNode: audioContext.createGain(), // Create the gain node we'll use to controll the duration of the delay
      delayNode: audioContext.createDelay(), // Create the delay node
    };

    // Wire it all up
    this.nodes.inputGainNode.connect(this.nodes.wetGainNode);
    this.nodes.inputGainNode.connect(this.nodes.delayNode);
    this.nodes.durationGainNode.connect(this.nodes.delayNode);
    this.nodes.delayNode.connect(this.nodes.durationGainNode);
    this.nodes.delayNode.connect(this.nodes.outputGainNode);
    this.nodes.wetGainNode.connect(this.nodes.outputGainNode);

    // Set the input gain-node as the input-node.
    this.node = this.nodes.inputGainNode;
    // Set the output gain-node as the output-node.
    this.output = this.nodes.outputGainNode;
    this.nodes.wetGainNode.gain.value = this.data.params.wet;

    this.nodes.delayNode.delayTime.value = this.data.params.time;
    this.nodes.durationGainNode.gain.value = this.data.params.duration;

    this.sliderWet = new Slider(
      this.element,
      this.nodes.wetGainNode.gain.value,
      0.1,
      "Wet"
    );

    this.sliderWet.createEvent(this.setWet.bind(this));
    this.sliderTime = new Slider(
      this.element,
      this.nodes.delayNode.delayTime.value,
      0.1,
      "Duration"
    );

    this.sliderTime.createEvent(this.setTime.bind(this));
    this.sliderDuration = new Slider(
      this.element,
      this.nodes.durationGainNode.gain.value,
      0.1,
      "Decay"
    );

    this.sliderDuration.createEvent(this.setDuration.bind(this));
  }
  setWet(val) {
    this.nodes.wetGainNode.gain.value = val / 10;
    this.data.params.wet = val / 10;
  }
  setTime(val) {
    this.nodes.delayNode.delayTime.value = val / 10;
    this.data.params.time = val / 10;
  }
  setDuration(val) {
    this.nodes.durationGainNode.gain.value = val / 10;
    this.data.params.duration = val / 10;
  }

  getParams() {
    return {
      name: "Delay",
    };
  }
}

export default Delay;
