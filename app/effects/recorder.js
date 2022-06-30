class Recorder {
  constructor(audioContext) {
    this.dest = audioContext.createMediaStreamDestination();
    this.recordButton = document.getElementById("recordButton");
    this.recordButton.addEventListener(
      "click",
      this.toggleRecording.bind(this)
    );
  }

  setInput(node) {
    this.dest.disconnect();
    node.output.connect(this.dest);
    this.gumStream = this.dest.stream;
  }

  toggleRecording() {
    if (this.recorder && this.recorder.state == "recording") {
      this.recorder.stop();
      this.recordButton.style.backgroundColor = "green";
    } else {
      this.recordButton.style.backgroundColor = "red";
      this.recorder = new MediaRecorder(this.dest.stream);

      this.recorder.start();
      this.recorder.ondataavailable = function (e) {
        var url = URL.createObjectURL(e.data);
        let preview = document.getElementById("audio-record");
        preview.controls = true;
        preview.src = url;
      };
    }
  }
}

export default Recorder;
