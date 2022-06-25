


class Distortion extends AudioConnector {
    constructor(audioContext) {
        super(audioContext);
        this.buffer = null;
        this.max_size = Math.max(4,Math.floor(this.audioContext.sampleRate/5000));
        audioContext.decodeAudioData( request.response, function(buffer) { 
	    	this.buffer = buffer;
		} );
	
        this.nodes = {
            analyser: this.audioContext.createWaveShaper(), // Create the waveshaper-node we'll use to create the distortion effect.
            gainNode: this.audioContext.createGain(), // Create the gain-nodes we use to increase the gain.
            gainNode2: this.audioContext.createGain(),
            biquadFilterNode: this.audioContext.createBiquadFilter() // Create the biquad-filter-node we'll use to create a lowpass filter.
        };

        // Set the oversample value to 4x by default.
        this.nodes['waveshaper'].oversample = '4x';

        // Set the type of to lowpass by default.
        this.nodes['biquadFilterNode'].type = 'lowpass';

        // Set the frequency value to 2000 by default.
       this.nodes['biquadFilterNode'].frequency.value = 2000;

        // Connect all nodes together
        this.nodes['waveshaper'].connect(this.nodes['gainNode']);
        this.nodes['gainNode'].connect(this.nodes['gainNode2']);
        this.nodes['gainNode2'].connect(this.nodes['biquadFilterNode']);

        // Set the waveshaper-node as the input-node.
        this.node = this.nodes['waveshaper'];
        // Set the biquad-filter-node as the output-node.
        this.output = this.nodes['biquadFilterNode'];

        // The default intensity is 100.
        this.intensity = 100;

        // The default gain is 1.
        this.gain = 100;

        // // The lowpass filter is turned off by default.
   
        this.nodes['waveshaper'].curve = this.calculateDistortionCurve(this.intensity);
        this.nodes['gainNode'].gain.value = this.gain;
        this.nodes['gainNode2'].gain.value = 1 / this.gain;

    }
 

    autoCorrelate( buf, sampleRate ) {
        // Implements the ACF2+ algorithm
        var SIZE = buf.length;
        var rms = 0;
    
        for (var i=0;i<SIZE;i++) {
            var val = buf[i];
            rms += val*val;
        }
        rms = Math.sqrt(rms/SIZE);
        if (rms<0.01) // not enough signal
            return -1;
    
        var r1=0, r2=SIZE-1, thres=0.2;
        for (var i=0; i<SIZE/2; i++)
            if (Math.abs(buf[i])<thres) { r1=i; break; }
        for (var i=1; i<SIZE/2; i++)
            if (Math.abs(buf[SIZE-i])<thres) { r2=SIZE-i; break; }
    
        buf = buf.slice(r1,r2);
        SIZE = buf.length;
    
        var c = new Array(SIZE).fill(0);
        for (var i=0; i<SIZE; i++)
            for (var j=0; j<SIZE-i; j++)
                c[i] = c[i] + buf[j]*buf[j+i];
    
        var d=0; while (c[d]>c[d+1]) d++;
        var maxval=-1, maxpos=-1;
        for (var i=d; i<SIZE; i++) {
            if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
            }
        }
        var T0 = maxpos;
    
        var x1=c[T0-1], x2=c[T0], x3=c[T0+1];
        a = (x1 + x3 - 2*x2)/2;
        b = (x3 - x1)/2;
        if (a) T0 = T0 - b/(2*a);
    
        return sampleRate/T0;
    }

   connect(node) {

    this.output.connect(node.node);

    return node;
    }
}